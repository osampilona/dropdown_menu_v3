# Unfolding Nested Menus React Application

## Overview

This React application leverages `react-aria` and `react-stately` to develop accessible, nested menus within a UI component framework. The primary goal is to ensure both accessibility and interactive behavior for nested menu components, catering to a wide range of users including those who rely on keyboard navigation.

## Features

- **Accessibility**: The application is designed to be fully accessible using both mouse and keyboard inputs, ensuring compliance with web accessibility standards.
- **Behavioral Consistency**: Provides expected interactions with nested menus using mouse clicks and keyboard navigation, enhancing user experience by maintaining consistent behavior across different input methods.

## Dependencies

The application strictly adheres to the specified versions of dependencies and development dependencies as outlined in the provided task requirements. This ensures compatibility and stability of the application's features and its expected behaviors.

## Keyboard Navigation

The application supports an intuitive keyboard navigation flow:

1. **Initial Focus**: Users can press the "tab" key to focus on the "Actions" button.
2. **Opening the Main Menu**: Pressing "Enter" opens the main menu.
3. **Navigating Menu Items**: Users can navigate through menu items using the "ArrowUp" and "ArrowDown" keys. Pressing "Enter" on specific items will either perform an action or, for items like "Copy application", "Rename application", and "Delete application", no action will be taken.
4. **Nested Menus**: Accessing nested menus is straightforward. Users can navigate to an item like "Move to", press "Enter" or "ArrowRight" to open a nested menu, and then use "ArrowUp" or "ArrowDown" to select a specific item within the nested menu. Pressing "Enter" selects the item and closes the nested menu, bringing the focus back to the main menu.

## Mouse Interaction

With mouse interaction, the application behaves as expected:

- Clicking an item within a nested menu closes the nested menu while keeping the main menu open.
- The main menu can be closed by clicking outside the menu area or by interacting with the "Actions" button again.

## UI Consistency

The application boasts a pixel-perfect UI, ensuring that the visual elements meet the specified design requirements without compromise.

## Conclusion

This React application demonstrates the effective use of `react-aria` and `react-stately` to achieve an accessible and user-friendly menu navigation experience. By adhering to the specified dependency versions and implementing a comprehensive keyboard and mouse interaction model, this application sets a high standard for UI component development in React environments.
