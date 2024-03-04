import React, { ButtonHTMLAttributes, Key, RefObject } from "react";
import { AriaMenuProps, MenuTriggerProps } from "@react-types/menu";
import { Node } from "@react-types/shared";
import { TreeState } from "@react-stately/tree";
import { MenuTriggerState } from "@react-stately/menu";

export type SapphireSubMenuProps<T extends object> = AriaMenuProps<T> &
  MenuTriggerProps & {
    renderTrigger: (
      props: ButtonHTMLAttributes<Element> & { ref?: RefObject<any> },
      isOpen: boolean
    ) => React.ReactNode;
    refTriggerItem: RefObject<HTMLLIElement>;
    statePopOver: MenuTriggerState;
    shouldFlip?: boolean;
  };

export type SapphireMenuProps<T extends object> = AriaMenuProps<T> &
  MenuTriggerProps & {
    renderTrigger: (
      props: ButtonHTMLAttributes<Element> & { ref?: RefObject<any> },
      isOpen: boolean
    ) => React.ReactNode;
    shouldFlip?: boolean;
  };

export interface MenuItemProps<T> {
  item: Node<T>;
  state: TreeState<T>;
  onAction?: (key: Key) => void;
  onClose?: () => void;
  disabledKeys?: Iterable<Key>;
  shouldFlip?: boolean;
}
