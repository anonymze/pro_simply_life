"use dom";

import "@/styles/app.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "./sign-pdf-layout.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";

import React from "react";
import type { DOMProps } from "expo/dom";
import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin, ToolbarProps } from "@react-pdf-viewer/default-layout";
import * as pdfjsLib from "pdfjs-dist";
import config from "tailwind.config";
import { I18n } from "@/types/i18n";
import { i18n } from "@/i18n/translations";
import { pdfViewerStatePlugin } from "./scale-plugin";

const workerUrl = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";

// dom props is needed otherwise the component crash
export default function SignPdf({
	dom,
	languageCode,
	querySavePdf,
}: {
	dom: DOMProps;
	languageCode: I18n;
	querySavePdf: ({ files }: { files: string[] }) => Promise<any>;
}) {
	// Sample PDF URL - you can replace with your own
	const [pdfUrl, setPdfUrl] = React.useState(require("@/assets/pdfs/adobe.pdf"));
	const [checkingSignaturesFieldsPresence, setCheckingSignaturesFieldsPresence] = React.useState(true);
	const [signatureFields, setSignatureFields] = React.useState<SignatureField[]>([]);
	const [fieldSignatures, setFieldSignatures] = React.useState<Record<string, string>>({});
	const [saving, setSaving] = React.useState(false);
	const [scale, setScale] = React.useState<number>(1);

	const savePdf = React.useCallback(async () => {
		try {
			setSaving(true);
			const viewer = document.querySelector(".rpv-core__viewer");
			if (!viewer) return;

			// Get all page containers
			const pageContainers = viewer.querySelectorAll(".rpv-core__page-layer");

			// Process canvases asynchronously
			const base64Pages = [];
			for (const container of Array.from(pageContainers)) {
				const canvas = container.querySelector("canvas");
				if (!canvas) continue;

				// Break up the synchronous toDataURL calls (otherwise it blocks the main thread for loader state)
				// toDataUrl is expensive synchronous call
				// the secret is to call requestAnimationFrame to have a "rerender" before next animation
				const dataUrl = await new Promise<string>((resolve) => {
					requestAnimationFrame(() => {
						resolve(canvas.toDataURL("image/png"));
					});
				});
				base64Pages.push(dataUrl);
			}

			// Create a text area to copy the content
			const textArea = document.createElement("textarea");
			textArea.value = base64Pages[0];
			document.body.appendChild(textArea);
			textArea.select();

			try {
				await navigator.clipboard.writeText(textArea.value);
				// alert("Base64 copied to clipboard!");
			} catch (err) {
				// Fallback for older browsers
				document.execCommand("copy");
				// alert("Base64 copied to clipboard!");
			}

			document.body.removeChild(textArea);

			await querySavePdf({ files: base64Pages });
			setSaving(false);
		} catch (error) {
			document;

			setSaving(false);
			alert(i18n[languageCode]("ERROR_PDF_MESSAGE"));
		}
	}, []);

	// THESE ARE HOOKS DON'T BE FOOLED
	// add the scale plugin
	const pdfViewerStatePluginInstance = pdfViewerStatePlugin();

	// add the layout plugin instance
	const defaultLayoutPluginInstance = defaultLayoutPlugin({
		sidebarTabs: (_) => [],
		renderToolbar: (props) =>
			ToolbarComponent({
				Toolbar: props,
				// isChecking: checkingSignaturesFieldsPresence,
				// signatureFieldCount: signatureFields.length,
				saving,
				languageCode,
				savePdf,
			}),
	});

	React.useEffect(() => {
		// Function to check for signature fields
		const checkForSignatureFields = async () => {
			try {
				setCheckingSignaturesFieldsPresence(true);
				// Loading PDF to check for signature fields

				// For local files, we need to handle them differently
				let pdfData;
				try {
					// Try to fetch the PDF if it's a URL
					const response = await fetch(pdfUrl);
					pdfData = await response.arrayBuffer();
				} catch (error) {
					pdfData = pdfUrl;
				}

				// Load the PDF document
				const loadingTask = pdfjsLib.getDocument(pdfData);
				const pdfDocument = await loadingTask.promise;

				// PDF loaded, checking for signature fields...
				let fields: SignatureField[] = [];

				// Check each page for annotations (which include form fields)
				for (let i = 1; i <= pdfDocument.numPages; i++) {
					const page = await pdfDocument.getPage(i);
					const annotations = await page.getAnnotations();

					// Form fields are typically annotations with the 'Widget' subtype
					const formFieldAnnotations = annotations.filter((annotation) => annotation.subtype === "Widget");

					// Check for signature fields
					const signatureFields = formFieldAnnotations.filter(
						(annotation) =>
							annotation.fieldType === "Sig" ||
							(annotation.fieldName && annotation.fieldName.toLowerCase().includes("signature")),
					);

					fields.push(
						...signatureFields.map((field) => ({
							pageIndex: i - 1,
							rect: {
								left: field.rect[0],
								top: field.rect[1],
								width: field.rect[2] - field.rect[0],
								height: field.rect[3] - field.rect[1],
							},
						})),
					);
				}

				setSignatureFields(fields);
			} catch (error) {
				console.error("Error checking for signature fields:", error);
				setSignatureFields([]);
			} finally {
				setCheckingSignaturesFieldsPresence(false);
			}
		};

		checkForSignatureFields();
	}, [pdfUrl]);

	const handleSignatureUpload = async (event: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result as string;
				setFieldSignatures((prev) => ({
					...prev,
					[fieldId]: result,
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div style={{ height: "100dvh", width: "100%" }}>
			<Worker workerUrl={workerUrl}>
				<Viewer
					fileUrl={pdfUrl}
					plugins={[defaultLayoutPluginInstance, pdfViewerStatePluginInstance]}
					defaultScale={SpecialZoomLevel.PageWidth}
					onZoom={(e) => {
						setScale(e.scale);
					}}
					onDocumentLoad={() => {
						setScale(pdfViewerStatePluginInstance.getViewerState()?.scale ?? 1);
					}}
					// renderPage={(props) => (
					// 	<div>
					// 		{props.canvasLayer.children}
					// 		{props.textLayer.children}
					// 		{signatureFields
					// 			.filter((field) => field.pageIndex === props.pageIndex)
					// 			.map((field, index) => {
					// 				const fieldId = `${field.pageIndex}-${index}`;
					// 				const signature = fieldSignatures[fieldId];

					// 				return (
					// 					<div
					// 						key={index}
					// 						style={{
					// 							position: "absolute",
					// 							left: `${field.rect.left * scale}px`,
					// 							top: `${field.rect.top * scale}px`,
					// 							width: `${field.rect.width * scale}px`,
					// 							height: `${field.rect.height * scale}px`,
					// 							minWidth: `${80 * scale}px`,
					// 							zIndex: 20,
					// 						}}
					// 					>
					// 						{signature ? (
					// 							<img src={signature} alt="Signature" className="h-full w-full object-cover" />
					// 						) : (
					// 							<label
					// 								htmlFor={`file-input-${fieldId}`}
					// 								className="flex h-full w-full items-center justify-center border-2 border-dashed"
					// 								style={{
					// 									borderColor: config.theme.extend.colors.primary,
					// 									backgroundColor: config.theme.extend.colors.primary,
					// 								}}
					// 							>
					// 								<p style={{ fontSize: `${20 * scale}px` }} className="font-bold text-white">
					// 									{i18n[languageCode]("SIGNATURE_HERE")}
					// 								</p>
					// 							</label>
					// 						)}
					// 						<input
					// 							type="file"
					// 							accept="image/*"
					// 							multiple={false}
					// 							id={`file-input-${fieldId}`}
					// 							onChange={(e) => handleSignatureUpload(e, fieldId)}
					// 							className="hidden"
					// 						/>
					// 					</div>
					// 				);
					// 			})}
					// 	</div>
					// )}
				/>
			</Worker>
		</div>
	);
}

const ToolbarComponent = ({
	Toolbar,
	languageCode,
	savePdf,
	saving,
}: {
	Toolbar: (props: ToolbarProps) => React.ReactElement;
	savePdf: () => void;
	languageCode: I18n;
	saving: boolean;
}) => {
	return (
		<Toolbar>
			{(slots) => {
				const { GoToNextPage, GoToPreviousPage, NumberOfPages, CurrentPageLabel, ZoomIn, ZoomOut } = slots;

				return (
					<>
						<style>
							{`
							.rpv-default-layout__toolbar {
								--rpv-default-layout__toolbar-background-color: ${config.theme.extend.colors.primary};
								--rpv-default-layout__toolbar-text-color: #fff;
							}
						`}
						</style>
						<div className="flex h-full w-full items-center justify-between px-3">
							<div className="flex items-center justify-center gap-0.5">
								<div className="w-[2ch]">
									<CurrentPageLabel />
								</div>
								<div className="w-[0.9rem]">/</div>
								<div className="w-[2ch]">
									<NumberOfPages />
								</div>
							</div>
							<div className="flex items-center gap-1">
								<GoToPreviousPage>
									{(props) => (
										<button
											disabled={props.isDisabled}
											onClick={props.onClick}
											className="h-10 rounded px-2 text-white active:bg-black/25 disabled:pointer-events-none disabled:opacity-50"
										>
											<PreviousPageIcon />
										</button>
									)}
								</GoToPreviousPage>

								<GoToNextPage>
									{(props) => (
										<button
											disabled={props.isDisabled}
											onClick={props.onClick}
											className="h-10 rounded px-2 text-white active:bg-black/25 disabled:pointer-events-none disabled:opacity-50"
										>
											<NextPageIcon />
										</button>
									)}
								</GoToNextPage>
							</div>
							<div className="flex items-center gap-2">
								<ZoomOut>
									{(props) => (
										<button onClick={props.onClick} className="h-10 rounded px-2 text-white active:bg-black/25">
											<ZoomOutIcon />
										</button>
									)}
								</ZoomOut>
								<ZoomIn>
									{(props) => (
										<button onClick={props.onClick} className="h-10 rounded px-2 text-white active:bg-black/25">
											<ZoomInIcon />
										</button>
									)}
								</ZoomIn>
							</div>
							<div className="flex items-center">
								<button
									disabled={saving}
									onClick={savePdf}
									className="relative flex h-6 w-20 items-center justify-center overflow-hidden rounded bg-white text-xs text-primary active:opacity-80 disabled:opacity-90"
								>
									<span
										className={`absolute transform transition-all duration-300 ${
											saving ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100"
										}`}
									>
										{i18n[languageCode]("SAVE")}
									</span>
									<span
										className={`absolute transform transition-all duration-300 ${
											saving ? "translate-y-0.5 opacity-100" : "translate-y-2 opacity-0"
										}`}
									>
										<span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-white" />
									</span>
								</button>
							</div>
						</div>
					</>
				);
			}}
		</Toolbar>
	);
};

const ZoomInIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="lucide lucide-zoom-in"
		>
			<circle cx="11" cy="11" r="8" />
			<line x1="21" x2="16.65" y1="21" y2="16.65" />
			<line x1="11" x2="11" y1="8" y2="14" />
			<line x1="8" x2="14" y1="11" y2="11" />
		</svg>
	);
};

const ZoomOutIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="lucide lucide-zoom-out"
		>
			<circle cx="11" cy="11" r="8" />
			<line x1="21" x2="16.65" y1="21" y2="16.65" />
			<line x1="8" x2="14" y1="11" y2="11" />
		</svg>
	);
};

const NextPageIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="lucide lucide-chevron-down"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	);
};

const PreviousPageIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="lucide lucide-chevron-up"
		>
			<path d="m18 15-6-6-6 6" />
		</svg>
	);
};

// Add this new type after the imports
type SignatureField = {
	pageIndex: number;
	rect: { left: number; top: number; width: number; height: number };
};
