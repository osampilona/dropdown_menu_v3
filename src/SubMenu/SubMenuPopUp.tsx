import React, { ReactNode, useRef } from "react";
import { useTreeState } from "@react-stately/tree";
import { useMenu } from "@react-aria/menu";
import { FocusStrategy } from "@react-types/shared";
import { SapphireSubMenuProps } from "../Menu/menu-interface";
import SubMenuItem from "./SubMenuItem";
import styles from "../Menu/Menu.module.css";

function SubMenuPopUp<T extends object>(
  props: {
    autoFocus: FocusStrategy;
    onClose: () => void;
  } & SapphireSubMenuProps<T>
) {
  const state = useTreeState({ ...props });
  const menuRef = useRef<HTMLUListElement>(null);

  const { menuProps } = useMenu(props, state, menuRef);

  const renderMenuItem = (): ReactNode => {
    return [...state.collection].map((item) => {
      if (item.type === "section") {
        throw new Error("Sections not supported");
      }

      return (
        <SubMenuItem<T>
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
}

export default SubMenuPopUp;
