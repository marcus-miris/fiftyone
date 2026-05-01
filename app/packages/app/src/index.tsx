/// <reference types="./env.d.ts" />
import { ErrorBoundary, ThemeProvider } from "@fiftyone/components";
import * as fol3d from "@fiftyone/looker-3d";
import { BeforeScreenshotContext, screenshotCallbacks } from "@fiftyone/state";
import { SnackbarProvider } from "notistack";
import type React from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import * as THREE from "three";
import Network from "./Network";
import "./index.css";
import "@voxel51/voodo/theme.css";
import { useRouter } from "./routing";

// Expose looker-3d's exports (including the re-exported R3F hooks) and the
// shared THREE namespace so plugins can use the host's instances at runtime
// via the externalized __fol3d__ / THREE globals. Set up here, outside
// @fiftyone/plugins/externalize.ts, to avoid the circular import that
// prevented this in upstream.
if (typeof window !== "undefined") {
  type Globals = { __fol3d__?: typeof fol3d; THREE?: typeof THREE };
  const w = window as Window & Globals;
  w.__fol3d__ = fol3d;
  w.THREE = THREE;
}

if (process.env.NODE_ENV === "development" && import.meta.env.VITE_DEV_WORKTREE_NAME) {
  document.title = `${document.title} (${import.meta.env.VITE_DEV_WORKTREE_NAME})`;
}

const App: React.FC = () => {
  const { context, environment } = useRouter();

  return <Network environment={environment} context={context} />;
};

createRoot(document.getElementById("root") as HTMLDivElement).render(
  <RecoilRoot>
    <ThemeProvider>
      <ErrorBoundary>
        <BeforeScreenshotContext.Provider value={screenshotCallbacks}>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </BeforeScreenshotContext.Provider>
      </ErrorBoundary>
    </ThemeProvider>
  </RecoilRoot>
);
