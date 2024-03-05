import { ReactElement, useLayoutEffect, useRef, forwardRef } from "react";
import { useMenuTriggerState } from "@react-stately/menu";
import { useMenuTrigger } from "@react-aria/menu";
import { useButton } from "@react-aria/button";
import { FocusScope } from "@react-aria/focus";
import { useOverlayPosition } from "@react-aria/overlays";
import { mergeProps } from "@react-aria/utils";
import { useFocusableRef, useUnwrapDOMRef } from "@react-spectrum/utils";
import { FocusableRef, DOMRefValue } from "@react-types/shared";
import { SapphireMenuProps } from "./menu-interface";
import { Popover } from "../Popover";
import MenuPopup from "./MenuPopUp";
import styles from "../Menu/Menu.module.css";
import clsx from "clsx";

function _Menu<T extends object>(
  props: SapphireMenuProps<T>,
  ref: FocusableRef<HTMLButtonElement>
) {
  const { renderTrigger, shouldFlip = true } = props;
  const state = useMenuTriggerState(props);

  const triggerRef = useFocusableRef<HTMLButtonElement>(ref);
  const popoverRef = useRef<DOMRefValue<HTMLDivElement>>(null);
  const unwrappedPopoverRef = useUnwrapDOMRef(popoverRef);
  const { menuTriggerProps, menuProps } = useMenuTrigger(
    props,
    state,
    triggerRef
  );
  const { buttonProps } = useButton(menuTriggerProps, triggerRef);

  const { overlayProps, updatePosition } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef: unwrappedPopoverRef,
    isOpen: state.isOpen,
    placement: "bottom start",
    offset: 6,
    onClose: state.close,
    shouldFlip,
  });

  // Fixes an issue where menu with controlled open state opens in wrong place the first time
  useLayoutEffect(() => {
    if (state.isOpen) {
      requestAnimationFrame(() => {
        updatePosition();
      });
    }
  }, [state.isOpen, updatePosition]);

  return (
    <>
      {renderTrigger({ ref: triggerRef, ...buttonProps }, state.isOpen)}
      <Popover
        isOpen={state.isOpen}
        ref={popoverRef}
        style={overlayProps.style || {}}
        className={clsx(styles["sapphire-menu-container"])}
        shouldCloseOnBlur
        onClose={state.close}
      >
        <FocusScope autoFocus>
          <MenuPopup<T>
            {...mergeProps(props, menuProps)}
            autoFocus={state.focusStrategy || true}
            onClose={state.open}
          />
        </FocusScope>
      </Popover>
    </>
  );
}

export const Menu = forwardRef(_Menu) as <T extends object>(
  props: SapphireMenuProps<T>,
  ref: FocusableRef<HTMLButtonElement>
) => ReactElement;
