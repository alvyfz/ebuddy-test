"use client";

import { useGlobalState } from "@/context/globalContext";
import { Modal } from "@mantine/core";

export default function ModalProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [state, setState] = useGlobalState();
  const modal = state.modal;

  const onClose = () => {
    if (modal?.onClose) {
      modal.onClose();
    }
    setState("modal", {
      ...modal,
      visible: false,
    });
  };
  return (
    <>
      <Modal
        opened={modal?.visible}
        onClose={onClose}
        title={modal?.title || undefined}
        closeOnClickOutside={!modal?.hiddenClose}
        withCloseButton={!modal?.hiddenClose}
        size="auto"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {modal?.component}
      </Modal>
      {children}
    </>
  );
}
