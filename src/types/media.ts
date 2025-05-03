export interface Media {
	id: string;
	alt: string;
	prefix?: string | null;
	updatedAt: string;
	createdAt: string;
	url?: string | null;
	blurhash?: string | null;
	thumbnailURL?: string | null;
	filename?: string | null;
	mimeType?: string | null;
	filesize?: number | null;
	width?: number | null;
	height?: number | null;
	focalX?: number | null;
	focalY?: number | null;
}
