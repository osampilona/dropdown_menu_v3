import React, { useEffect } from "react";
import { useMenuTriggerState } from "@react-stately/menu";
import { useFocusRing } from "@react-aria/focus";
import { useMenuItem } from "@react-aria/menu";
import { mergeProps } from "@react-aria/utils";
import { useHover } from "@react-aria/interactions";
import { MenuItemProps } from "./menu-interface";
import { CollectionChildren } from "@react-types/shared";
import SubMenu from "../SubMenu/SubMenu";
import { Item } from "./index";
import styles from "../Menu/Menu.module.css";
import clsx from "clsx";

function MenuItem<T>({
  item,
  state,
  disabledKeys,
  onClose,
}: MenuItemProps<T>): JSX.Element {
  const checkNodeChild: boolean = item.hasChildNodes;

  const ref = React.useRef<HTMLLIElement>(null);

  const isDisabled = disabledKeys && [...disabledKeys].includes(item.key);

  let statePopOver = useMenuTriggerState({});

  const onActionMenuItems = (key: React.Key) => {
    if (checkNodeChild) {
      statePopOver.open();
    }
  };

  const { menuItemProps } = useMenuItem(
    {
      key: item.key,
      isDisabled,
      onAction: (key) => onActionMenuItems(key),
      onClose,
    },
    state,
    ref
  );

  const { hoverProps, isHovered } = useHover({ isDisabled });
  const { focusProps, isFocusVisible } = useFocusRing();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && !statePopOver.isOpen) {
        statePopOver.open();
      }
    };

    const node = ref.current;
    node?.addEventListener("keydown", handleKeyDown);

    return () => {
      node?.removeEventListener("keydown", handleKeyDown);
    };
  }, [statePopOver]);

  const renderSubMenuItems: (item: any) => CollectionChildren<object> = (
    item
  ) => {
    if (!item) return null;

    return item.props.children.map((li: any) => {
      return <Item key={li.key}>{li.props.children}</Item>;
    });
  };

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

export default MenuItem;
