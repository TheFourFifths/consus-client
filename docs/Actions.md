# Actions

This document describes the Flux actions used in the Consus client.

## Table of Contents

- [Actions](#actions)
    - [Table of contents](#table-of-contents)
    - [ADD_ITEM_FAULT](#add_item_fault)
    - [ADMIN_CODE_ENTERED](#admin_code_entered)
    - [CHECKIN_SUCCESS](#checkin_success)
    - [CHECKOUT_ITEM_FOUND](#checkout_item_found)
    - [CHECKOUT_SUCCESS](#checkout_success)
    - [CLEAR_ADMIN_CODE](#clear_admin_code)
    - [CLEAR_ADMIN_WINDOW](#clear_admin_window)
    - [CLEAR_ALL_DATA](#clear_all_data)
    - [CLEAR_ERROR](#clear_error)
    - [CLEAR_CART_CONTENTS](#clear_cart_contents)
    - [CREATE_STUDENT](#create_student)
    - [CREATE_TOAST](#create_toast)
    - [DEBUG](#debug)
    - [EDIT_IS_LONGTERM](#edit_is_longterm)
    - [EDIT_LONGTERM_DUEDATE](#edit_longterm_duedate)
    - [EDIT_LONGTERM_PROFESSOR](#edit_longterm_professor)
    - [ERROR](#error)
    - [FAULTY_ITEMS_RECEIVED](#faulty_items_received)
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
    - [RETRIEVE_ITEM](#retrieve_item)
    - [RETRIEVE_MODEL](#retrieve_model)
    - [SAVE_ITEM](#save_item)
    - [SAVE_MODEL](#save_model)
    - [STUDENT_FOUND](#student_found)
    - [STUDENT_UPDATED](#student_updated)
    - [STUDENTS_FOUND](#students_found)
    - [STUDENTS_UPLOADED](#students_uploaded)
    - [UNSERIALIZED_MODEL_ADDED](#unserialized_model_added)
    - [WARN](#warn)
    - [PROMPT_TO_PRINT](#prompt_to_print)

## ADD_ITEM_FAULT

Dispatched when adding a fault to an item.

### Data

- `itemAddress`: The Item to add the fault to
- `fault`: An object containing the description and timestamp of the fault.

```json
{
    "itemAddress": "address",
    "fault" : {
        "timestamp" :1020221,
        "description": "Something broke?!?!?!"
    }
}
```

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

## CREATE_STUDENT

Dispatched once a student id and rfid have been received and the student form is displayed

### Data

- `rfid`: the rfid of the unknown ID card
- `id`: the entered student ID that was not found

```json
{
    "rfid": 123456,
    "id": 123456
}
```

## EDIT_IS_LONGTERM

Dispatched when an edit is made to the cart-panel in the longterm section. The data is stored this way to mimic
the way a normal checkout occurs. See [CHECKOUT_ITEM_FOUND](#checkout_item_found).

### Data

- `isLongterm `: a boolean indicating if the current checkout is set for longterm

```json
{
    "isLongterm": true
}
```

## EDIT_LONGTERM_DUEDATE

Dispatched when an edit is made to the cart-panel in the longterm section. The data is stored this way to mimic
the way a normal checkout occurs. See [CHECKOUT_ITEM_FOUND](#checkout_item_found).

### Data

- `dueDate`: a Date object

```json
{
    "dueDate": "Some Date object that probably won't be Sun Mar 26 2017 15:12:34 GMT-0500"
}
```

## EDIT_LONGTERM_PROFESSOR

Dispatched when an edit is made to the cart-panel in the longterm section. The data is stored this way to mimic
the way a normal checkout occurs. See [CHECKOUT_ITEM_FOUND](#checkout_item_found).

### Data

- `professor `: a string representation of the professors name for longterm checkout

```json
{
    "professor": "Professor Wiffle"
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

## FAULTY_ITEMS_RECEIVED

Dispatched when a list of faulty items is retrieved from the server.

### Data

None.

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

## RETRIEVE_ITEM

Mark an item as retrieved.

### Data

- `itemAddress`: The address of the item that was retrieved

```json
{
    "itemAddress": "iGwEZUvfA"
}
```

## RETRIEVE_MODEL

Mark a model as retrieved.

### Data

- `modelAddress`: The address of the model that was retrieving

```json
{
    "studentId": 123456,
    "modelAddress": "myxEb109"
}
```

## SAVE_ITEM

Mark an item as saved.

### Data

- `itemAddress`: The address of the item that was saved

```json
{
    "itemAddress": "iGwEZUvfA"
}
```

## SAVE_MODEL

Mark a model as saved.

### Data

- `modelAddress`: The address of the model that was saved

```json
{
    "modelAddress": "myxEb109"
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

## UNSERIALIZED_MODEL_ADDED

Dispatched when a new instance of an unserialzed model is created and the total and in stock values have been incremented

### Data

An entire model object as received from the server.

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
