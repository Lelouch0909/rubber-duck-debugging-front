'use client';
import React, { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import EditorNavbar from '../editor/EditorNavbar';
import { ImperativePanelHandle } from 'react-resizable-panels';

function MainRubberLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const panelEditorRef = React.useRef<ImperativePanelHandle>(null);
  const panelSidebarRef = React.useRef<ImperativePanelHandle>(null);

  return (
    <>
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isEditorOpen={isEditorOpen}
        setIsEditorOpen={setIsEditorOpen}
        panelEditorRef={panelEditorRef}
        panelSidebarRef={panelSidebarRef}
      />
      <div className="overflow-hidden w-full relative h-[calc(100vh-5.2rem)]">
        <main className="flex-grow bg-slate-400 container h-full w-full">
          <ResizablePanelGroup
            direction="horizontal"
            className=" h-full w-full transition-all duration-200"
          >
            <ResizablePanel
              defaultSize={0}
              ref={panelSidebarRef}
              className="transition-all duration-200"
            >
              <div className="items-center justify-center p-4 transform transition-transform duration-200">
                <span className="font-semibold">Sidebar</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={100}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Content</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={0}
              ref={panelEditorRef}
              className="transition-all duration-200"
            >
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Editor</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>
    </>
  );
}

export default MainRubberLayout;
