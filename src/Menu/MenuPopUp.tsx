import React, { ReactNode, useRef } from "react";
import { useTreeState } from "@react-stately/tree";
import { useMenu } from "@react-aria/menu";
import { FocusStrategy } from "@react-types/shared";
import { SapphireMenuProps } from "../Menu/menu-interface";
import { MenuItem } from "../Menu/MenuItem";
import styles from "../Menu/Menu.module.css";

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

export default MenuPopup;
