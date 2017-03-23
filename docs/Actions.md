# Actions

This document describes the Flux actions used in the Consus client.

## Table of Contents

- [Actions](#actions)
    - [Table of contents](#table-of-contents)
    - [ADMIN_CODE_ENTERED](#admin_code_entered)
    - [CHECKIN_SUCCESS](#checkin_success)
    - [CHECKOUT_ITEM_FOUND](#checkout_item_found)
    - [CHECKOUT_SUCCESS](#checkout_success)
    - [CLEAR_ADMIN_CODE](#clear_admin_code)
    - [CLEAR_ADMIN_WINDOW](#clear_admin_window)
    - [CLEAR_ALL_DATA](#clear_all_data)
    - [CLEAR_ERROR](#clear_error)
    - [CLEAR_CART_CONTENTS](#clear_cart_contents)
    - [CREATE_TOAST](#create_toast)
    - [DEBUG](#debug)
    - [ERROR](#error)
    - [FILE_UNSUPPORTED](#file_unsupported)
    - [INFO](#info)
    - [INVALID_CODE](#invalid_code)
    - [ITEMS_RECEIVED](#items_received)
    - [ITEM_CREATED](#item_created)
    - [ITEM_DELETED](#item_deleted)
    - [ITEM_FOUND](#item_found)
    - [MODELS_RECEIVED](#models_received)
    - [MODEL_CREATED](#model_created)
    - [MODEL_CHECKIN_SUCCESS](#model_checkin_success)
    - [MODEL_FOUND](#model_found)
    - [NO_ITEM_FOUND](#no_item_found)
    - [NO_MODEL_FOUND](#no_model_found)
    - [OVERDUE_ITEMS_RECEIVED](#overdue_items_received)
    - [OVERRIDE_REQUIRED](#override_required)
    - [POP_TOAST](#pop_toast)
    - [SAVE_ITEM](#save_item)
    - [STUDENT_FOUND](#student_found)
    - [STUDENT_UPDATED](#student_updated)
    - [STUDENTS_FOUND](#students_found)
    - [STUDENTS_UPLOADED](#students_uploaded)
    - [WARN](#warn)
    - [PROMPT_TO_PRINT](#prompt_to_print)

## ADMIN_CODE_ENTERED

Dispatched when an admin code is entered.

### Data

- `adminCode`: the code that was entered


## CHECKIN_SUCCESS

Dispatched after items are successfully checked in.

### Data

- `itemAddress`: the address of the item that was checked in
- `modelName`: the model name of the item that was checked in


## CHECKOUT_ITEM_FOUND

Dispatched when an item was found on the server and is available for checkout.

### Data

An entire item object, as returned from the API.


## CHECKOUT_SUCCESS

Dispatched after a checkout has completed successfully.

### Data

None.


## CLEAR_ADMIN_CODE

Dispatched when the entered admin code is invalid.

### Data

None.


## CLEAR_ADMIN_WINDOW

Dispatched when the admin override process has been canceled.

### Data

None.


## CLEAR_ALL_DATA

Dispatched when _all_ data should be forgotten. For example, all items, models, errors, and students shall be deleted.

### Data

None.


## CLEAR_ERROR

Dispatched when an error should be cleared. Note that this also clears any "error" that was created by the DEBUG, INFO, WARN, or ERROR actions.

### Data

None.


## CLEAR_CART_CONTENTS

Dispatched when all contents of the current cart should be removed. It removes all items and models from the CartStore.

### Data

None.


## CREATE_TOAST

Dispatched when a toast should be displayed. Currently, the created toast is added to a queue of toasts to display.

### Data

- `text`: a string to display in toast
- `timeout`: the number of milliseconds to let the toast live before popping it

```json
{
    "text": "I really wish there was a toast emoji (in addiiton to bread)",
    "timeout": 10000
}
```


## DEBUG

Dispatched when a debug modal must be shown to the user.

### Data

- `debug`: the message to display

```json
{
    "debug": "Welcome to the searchItem() function! Enjoy your stay!"
}
```


## ERROR

Dispatched when an error modal must be shown to the user.

### Data

- `error`: the message to display

```json
{
    "error": "ERROR! CATASTROPHIC MELTDOWN IMMANENT!"
}
```


## FILE_UNSUPPORTED

Dispatched when the user tries to upload a file that is not supported

### Data

None.


## INFO

Dispatched when an informational modal must be shown to the user.

### Data

- `info`: the message to display

```json
{
    "info": "Jolly good day, please be aware that you clicked 'Yes'."
}
```


## INVALID_CODE

Dispatched when an incorrect admin code was entered.

### Data

None.


## ITEMS_RECEIVED

Dispatched after all items are fetched from the server, or when an item is deleted.

### Data

An array of item objects.


## ITEM_CREATED

Dispatched after an item has successfully been created.

### Data

The newly created item object.


## ITEM_DELETED

Dispatched after an item has successfully been deleted.

### Data

The item object that was deleted.


## ITEM_FOUND

Dispatched when an item has been found on the server.

### Data

The found item object.


## MODELS_RECEIVED

Dispatched when any number of models have been found on the server.

### Data

An array of model objects.


## MODEL_CREATED

Dispatched when a new model was created.

### Data

The newly created item object.


## MODEL_CHECKIN_SUCCESS

Dispatched a model is checked in.

### Data

The model address, name, and number checked in.


## MODEL_FOUND

Dispatched when a model has been found on the server.

## Data

The found model object.


## NO_ITEM_FOUND

Dispatched when searching for an item failed.

### Data

None.


## NO_MODEL_FOUND

Dispatched when searching for an item failed.

### Data

None.

## OVERDUE_ITEM_RECEIVED

Dispatched when the list of all overdue items is received from the server.

###Data

- `items`: the list of overdue items as JSON objects

## OVERRIDE_REQUIRED

Dispatched when an admin is required for an action to continue.

This may happen when a student attempts to checkout with overdue items.

### Data

None.


## POP_TOAST

Dispatched when a toast shall be popped.

### Data

- `id`: the ID of the toast to pop

```json
{
    "id": 3
}
```

## SAVE_ITEM

Mark an item as saved.

### Data

- `itemAddress`: the address of the item that was saved

```json
{
    "itemAddress": "iGwEZUvfA"
}
```

## STUDENT_FOUND

Dispatched when searching for a student has succeeded.

### Data

The found student object.


## STUDENT_UPDATED

Dispatched when updating student information.

## Data

An object containing the updated student information.

##STUDENTS_FOUND

Dispatched when retrieving all students has succeeded.

## Data

An array containing all of the student objects from the server.

## STUDENTS_UPLOADED

Dispatched when uploading excel doc has finished uploading to the server

### Data

None.

## WARN

Dispatched when a warning message must be shown the user.

### Data

- `warn`: the message to display

```json
{
    "warn": "Warning! Something mildly abnormal occured!"
}
```

## PROMPT_TO_PRINT

Dispatched when the user wishes to print a QR code.

### Data

- `text`: the text to be encoded into a QR code

```json
{
    "text": "m8y7nEtAe"
}
```
