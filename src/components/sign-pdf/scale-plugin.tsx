import { createStore, PluginFunctions, Plugin } from "@react-pdf-viewer/core";
import { ViewerState } from "@react-pdf-viewer/core";
import React from "react";


interface PdfViewerStatePlugin extends Plugin {
  getViewerState(): ViewerState | null;
}

interface StoreProps {
  getViewerState(): ViewerState;
}

export const pdfViewerStatePlugin = (): PdfViewerStatePlugin => {
  const store = React.useMemo(() => createStore<StoreProps>(), []);
  return {
    install: (pluginFunctions: PluginFunctions) => {
      store.update("getViewerState", pluginFunctions.getViewerState);
    },
    getViewerState: () => {
      const getViewerState = store.get("getViewerState");
      return getViewerState ? getViewerState() : null;
    },
  };
};
