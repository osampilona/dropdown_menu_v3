import React, {
  ReactElement,
  ReactNode,
  useLayoutEffect,
  useRef,
  forwardRef,
} from "react";
import { MenuTriggerState, useMenuTriggerState } from "@react-stately/menu";
import { useTreeState } from "@react-stately/tree";
import { useButton } from "@react-aria/button";
import { FocusScope, useFocusRing } from "@react-aria/focus";
import { useMenu, useMenuItem, useMenuTrigger } from "@react-aria/menu";
import { useOverlayPosition } from "@react-aria/overlays";
import { mergeProps } from "@react-aria/utils";
import { Popover } from "../Popover";
import { useFocusableRef, useUnwrapDOMRef } from "@react-spectrum/utils";
import { FocusableRef, FocusStrategy, DOMRefValue } from "@react-types/shared";
import styles from "./Menu.module.css";
import clsx from "clsx";
import { useHover } from "@react-aria/interactions";
import {
  SapphireMenuProps,
  MenuItemProps,
  SapphireSubMenuProps,
} from "./menu-interface";

import { CollectionChildren } from "@react-types/shared";
import { Item } from ".";

// Unique components for the SubMenuItems
export function SubMenuItem<T>({
  item,
  state,
  onAction,
  disabledKeys,
  onClose,
  statePopOver,
}: MenuItemProps<T> & {
  statePopOver: MenuTriggerState;
}): JSX.Element {
  const ref = useRef<HTMLLIElement>(null);
  const isDisabled = disabledKeys && [...disabledKeys].includes(item.key);

  const { menuItemProps } = useMenuItem(
    {
      key: item.key,
      isDisabled,
      onAction,
      onClose,
    },
    state,
    ref
  );

  const { hoverProps, isHovered } = useHover({ isDisabled });
  const { focusProps, isFocusVisible } = useFocusRing();

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event.key);
      console.log(statePopOver.isOpen);
      if (event.key === "ArrowLeft" && statePopOver.isOpen) {
        // Close submenu logic here
        statePopOver.close();
      }
    };

    const node = ref.current;
    node?.addEventListener("keydown", handleKeyDown);

    return () => {
      node?.removeEventListener("keydown", handleKeyDown);
    };
  }, [statePopOver, item.hasChildNodes]);

  return (
    <li
      ref={ref}
      {...mergeProps(menuItemProps, hoverProps, focusProps)}
      className={clsx(
        styles["sapphire-menu-item"],
        styles["js-focus"],
        styles["js-hover"],
        {
          [styles["is-disabled"]]: isDisabled,
          [styles["is-focus"]]: isFocusVisible,
          [styles["is-hover"]]: isHovered,
        }
      )}
    >
      <p className={styles["sapphire-menu-item-overflow"]}>{item.rendered}</p>
    </li>
  );
}

// Unique components for the SubMenuPopup
const SubMenuPopUp = <T extends object>(
  props: {
    autoFocus: FocusStrategy;
    onClose: () => void;
  } & SapphireSubMenuProps<T>
) => {
  const state = useTreeState({ ...props });
  const menuRef = useRef<HTMLUListElement>(null);

  const { menuProps } = useMenu(props, state, menuRef);

  const renderMenuItem = (): ReactNode => {
    return [...state.collection].map((item) => {
      if (item.type === "section") {
        throw new Error("Sections not supported");
      }

      return (
        <SubMenuItem
          key={item.key}
          item={item}
          state={state}
          onClose={props.onClose}
          onAction={props.onAction as (key: React.Key) => void}
          disabledKeys={props.disabledKeys}
          statePopOver={props.statePopOver}
        />
      );
    });
  };

  return (
    <>
      <ul {...menuProps} ref={menuRef} className={styles["sapphire-menu"]}>
        {renderMenuItem()}
      </ul>
    </>
  );
};

// Unique components for the SubMenu
const SubMenu = <T extends object>(props: SapphireSubMenuProps<T>) => {
  const {
    renderTrigger,
    refTriggerItem,
    statePopOver,
    shouldFlip = true,
  } = props;

  const popoverRef = useRef<DOMRefValue<HTMLDivElement>>(null);
  const unwrappedPopoverRef = useUnwrapDOMRef(popoverRef);

  // Using the reference from the Li Element from the MenuItem component
  const { menuTriggerProps, menuProps } = useMenuTrigger(
    props,
    statePopOver,
    refTriggerItem
  );

  const { buttonProps } = useButton(menuTriggerProps, refTriggerItem);

  // Using the state from the MenuItem function
  // It was declared on the MenuItem the useMenuTriggerState({});
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
        <FocusScope>
          <SubMenuPopUp
            {...mergeProps(props, menuProps)}
            autoFocus={statePopOver.focusStrategy || true}
            onClose={statePopOver.close}
            statePopOver={statePopOver}
          />
        </FocusScope>
      </Popover>
    </>
  );
};

export function MenuItem<T>({
  item,
  state,
  disabledKeys,
  onClose,
}: MenuItemProps<T>): JSX.Element {
  // Checking if any MenuItem has childNodes
  // ChildNodes means that the MenuItem is a subMenu
  const checkNodeChild: boolean = item.hasChildNodes;

  const ref = React.useRef<HTMLLIElement>(null);

  const isDisabled = disabledKeys && [...disabledKeys].includes(item.key);

  // Creating state for a triggerState for MenuItem
  let statePopOver = useMenuTriggerState({});

  // With the state from the useMenuTriggerState()
  // it is possible to implement custom action on each MenuItem
  // Opening the SubMenu by calling the open() function
  const onActionMenuItems = () => {
    // Checking if the menuItem there is other nodes
    if (checkNodeChild) {
      statePopOver.open();
    }
  };

  // Calling the onActionMenuItems function onAction parameter
  const { menuItemProps } = useMenuItem(
    {
      key: item.key,
      isDisabled,
      onAction: () => onActionMenuItems(),
      onClose,
    },
    state!,
    ref
  );

  const { hoverProps, isHovered } = useHover({ isDisabled });
  const { focusProps, isFocusVisible, isFocused } = useFocusRing();

  console.log("FOCUS PROPS:: ", isFocused);

  // Function to render the Items from a SubmenuItem with NodeChilds
  const renderSubMenuItems: (item: any) => CollectionChildren<object> = (
    item
  ) => {
    if (!item) return null;

    return item.props.children.map((li: any) => {
      return <Item key={li.key}>{li.props.children}</Item>;
    });
  };

  // Rendering the MenuItems buttons
  const renderItem = () => {
    return (
      <li
        ref={ref}
        {...mergeProps(menuItemProps, hoverProps, focusProps)}
        className={clsx(
          styles["sapphire-menu-item"],
          styles["js-focus"],
          styles["js-hover"],
          {
            [styles["is-disabled"]]: isDisabled,
            [styles["is-focus"]]: isFocusVisible,
            [styles["is-hover"]]: isHovered,
          }
        )}
      >
        <p className={styles["sapphire-menu-item-overflow"]}>
          {item.textValue}
        </p>
      </li>
    );
  };

  return (
    <>
      {!checkNodeChild && renderItem()}
      {checkNodeChild && (
        <SubMenu
          renderTrigger={() => renderItem()}
          refTriggerItem={ref}
          statePopOver={statePopOver}
        >
          {renderSubMenuItems(item)}
        </SubMenu>
      )}
    </>
  );
}

const MenuPopup = <T extends object>(
  props: {
    autoFocus: FocusStrategy;
    onClose: () => void;
  } & SapphireMenuProps<T>
) => {
  const state = useTreeState({ ...props, selectionMode: "none" });

  const menuRef = useRef<HTMLUListElement>(null);
  const { menuProps } = useMenu(props, state, menuRef);

  const renderMenuItem = (): ReactNode => {
    return [...state.collection].map((item) => {
      if (item.type === "section") {
        throw new Error("Sections not supported");
      }

      return (
        <MenuItem
          key={item.key}
          item={item}
          state={state}
          onClose={props.onClose}
          onAction={props.onAction as (key: React.Key) => void}
          disabledKeys={props.disabledKeys}
        />
      );
    });
  };

  return (
    <>
      <ul {...menuProps} ref={menuRef} className={styles["sapphire-menu"]}>
        {renderMenuItem()}
      </ul>
    </>
  );
};

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
        <FocusScope>
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
