/**
 * Supported Event Types
 * ---------------------
 * Below are the event types your custom web components can call and Outerbase
 * will listen and respond to with the corresponding action.
 * 
 * onEdit
 * onStopEdit
 * onCancelEdit
 * onSave
 * onUpdateRow
 * 
 * onEdit - Begins editing a table cell
 * onStopEdit - Stops editing a table cell
 * onCancelEdit - Stops editing a table cell and reverts changes
 * onSave - Saves all changes made by the user to the database
 * onUpdateRow - Sends updated data for a specified row for Outerbase to update when the save action occurs
 */