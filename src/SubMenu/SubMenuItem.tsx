import { useRef, useEffect } from "react";
import { MenuTriggerState } from "@react-stately/menu";
import { useFocusRing } from "@react-aria/focus";
import { useMenuItem } from "@react-aria/menu";
import { mergeProps } from "@react-aria/utils";
import { useHover } from "@react-aria/interactions";
import { MenuItemProps } from "../Menu/menu-interface";
import styles from "../Menu/Menu.module.css";
import clsx from "clsx";

export function SubMenuItem<T>({
  item,
  state,
  onAction,
  disabledKeys,
  onClose,
  statePopOver,
}: MenuItemProps<T> & {
  statePopOver: MenuTriggerState;
}) {
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event.key);
      console.log(statePopOver.isOpen);
      if (event.key === "ArrowLeft" && statePopOver.isOpen) {
        statePopOver.close();
        console.log("submenu is closed");
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
