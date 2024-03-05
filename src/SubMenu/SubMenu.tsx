import { useLayoutEffect, useRef } from "react";
import { useMenuTrigger } from "@react-aria/menu";
import { useButton } from "@react-aria/button";
import { FocusScope } from "@react-aria/focus";
import { useOverlayPosition } from "@react-aria/overlays";
import { mergeProps } from "@react-aria/utils";
import { useUnwrapDOMRef } from "@react-spectrum/utils";
import { DOMRefValue } from "@react-types/shared";
import { SapphireSubMenuProps } from "../Menu/menu-interface";
import { Popover } from "../Popover";
import SubMenuPopUp from "./SubMenuPopUp";
import styles from "../Menu/Menu.module.css";
import clsx from "clsx";

function SubMenu<T extends object>(props: SapphireSubMenuProps<T>) {
  const {
    renderTrigger,
    refTriggerItem,
    statePopOver,
    shouldFlip = true,
  } = props;
  const popoverRef = useRef<DOMRefValue<HTMLDivElement>>(null);
  const unwrappedPopoverRef = useUnwrapDOMRef(popoverRef);

  const { menuTriggerProps, menuProps } = useMenuTrigger(
    props,
    statePopOver,
    refTriggerItem
  );

  const { buttonProps } = useButton(menuTriggerProps, refTriggerItem);

  const { overlayProps, updatePosition } = useOverlayPosition({
    targetRef: refTriggerItem,
    overlayRef: unwrappedPopoverRef,
    isOpen: statePopOver.isOpen,
    placement: "right top",
    offset: 6,
    onClose: statePopOver.close,
    shouldFlip,
  });

  // Fixes an issue where menu with controlled open state opens in wrong place the first time
  useLayoutEffect(() => {
    if (statePopOver.isOpen) {
      requestAnimationFrame(() => {
        updatePosition();
      });
    }
  }, [statePopOver.isOpen, updatePosition]);

  return (
    <>
      {renderTrigger(
        { ref: refTriggerItem, ...buttonProps },
        statePopOver.isOpen
      )}
      <Popover
        isOpen={statePopOver.isOpen}
        ref={popoverRef}
        style={overlayProps.style || {}}
        className={clsx(styles["sapphire-menu-container"])}
        shouldCloseOnBlur
        onClose={statePopOver.close}
      >
        <FocusScope restoreFocus>
          <SubMenuPopUp<T>
            {...mergeProps(props, menuProps)}
            autoFocus={statePopOver.focusStrategy || true}
            onClose={statePopOver.close}
            statePopOver={statePopOver}
          />
        </FocusScope>
      </Popover>
    </>
  );
}

export default SubMenu;
