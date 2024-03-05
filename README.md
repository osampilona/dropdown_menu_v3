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
4. **Nested Menus**: Accessing nested menus is straightforward. Users can navigate to an item like "Move to", press "Enter" or "ArrowRight" to open a nested menu, and then use "ArrowUp" or "ArrowDown" to select a specific item within the nested menu.
5. **Options for closing nested menu**:
   1. No matter on which item in nested menu user is focused, they can close nested menu by pressing "ArrowLeft" and bring back focus to main menu on "Move to" item.
   2. Pressing "Enter" on selected item nested menu closes and focus is brought back to the main menu.
6. **Closing main menu**: User can press "Esc" button.

## Mouse Interaction

With mouse interaction, the application behaves as expected:

1. Clicking the "Actions" button main menu opens.
2. Clicking on "Copy application", "Rename application", and "Delete application" will not perform any action.
3. Clicking on "Move to" item opens nested menu.
4. Moving mouse from the opened nested menu to the main menu can close the nested menu.
5. Clicking an item within a nested menu closes the nested menu while keeping the main menu open.
6. The main menu can be closed by clicking outside the menu area or by interacting with the "Actions" button again.

## UI Consistency

The application boasts a pixel-perfect UI, ensuring that the visual elements meet the specified design requirements without compromise.

## Space for Improvement

While the application achieves its core objectives, there are areas that could be enhanced with deeper knowledge and application of `react-aria` and `react-stately`:

1. **Direct Selection of First Item in Nested Menu**: Ideally, when a nested menu is opened, the first item within it should be directly selected to streamline navigation.
2. **Closing Behavior on Item Selection**: Currently, selecting an item in a nested menu closes only the nested menu, but it would be more intuitive if both the nested menu and the main menu were to close upon selection. This adjustment would provide a cleaner and more consistent user experience.
3. **Enhancing UI**: User interface can and should be enhanced with indicator next to the "Move to" text, so user knows there should be some action applied to this specific item.

## Conclusion

This React application demonstrates the effective use of `react-aria` and `react-stately` to achieve an accessible and user-friendly menu navigation experience. By adhering to the specified dependency versions and implementing a comprehensive keyboard and mouse interaction model, this application sets a high standard for UI component development in React environments. Future enhancements, particularly in the areas identified for improvement, could further refine the user experience and functionality.
