# f2j: Form to JSON

A Javascript shim to transform HTML forms into JSON POST requests.
 
Add `onsubmit="return f2j(this)"` to any form and f2j will submit the form as a POST request containing `application/json` instead of key-value `application/form-urlencoded` parameters. 

## Benefits

F2j is:
- Lightweight, quick to load
- Interoperable, able to work easily with other libraries
- Transparent, with minimal domain-specific syntax

F2j exports a single function, `f2j`, which weighs in at approx 1.4kb (minified), depends on no other JS libraries, and is extremely simple to use and understand. Use f2j for:
- *Prototyping:* get a frontend that interacts with a REST API up and running in seconds
- *Vanilla JS:* projects that eschew full-blown frameworks
- *Lightweight interactivity:* add behavior to HTML pages without committing to a frontend framework
- *Reactive DOM updates:* use f2j's callbacks with your favorite rendering library to update the DOM

## Usage
To start using `f2j`, import the minified or unminified library
```
<script type="text/javascript" src="/js/f2j.min.js"></script>
```
Add the attribute `onsubmit="return f2j(this)` to the form you would like to submit as JSON. F2j will submit a JSON POST request, turning each form element's `name` into the JSON key and `value` into the value. For example: 
```
<form action="/my/json/api" onsubmit="return f2j(this)">
        <input type="hidden" name="questionId" value="12345">
        <input type="radio" name="agree" value="true" /> Agree
        <input type="radio" name="agree" value="false" checked /> Disagree
        <label>
            <p>What feedback do you have?</p>
            <textarea name="freeResponseFeedback">I have a few suggestions...</textarea>
        </label>
        <button type="submit">Save</button>
</form>
```

Results in the following JSON POST request:
```
{
    "questionId": 12345,
    "agree": false,
    "freeResponseFeedback": "I have a few suggestions...",
}
```

*Note:* the `return` before calling f2j (e.g. `return f2j(this)`) is necessary to prevent duplicate form submission.

## Supported elements

F2j supports the following HTML form elements:

 - `<input>` (all types)
 - `<textarea>`
 - `<select>`
 - `<button>`
 - `<submit>`
 
 Note that `<button type="submit">` and `<submit>` elements must have `name` and `value` attributes to be serialized as JSON; otherwise, they will simply act to submit the form. For example:
 ```
 <form action="/my/json/api" onsubmit="return f2j(this)">
        <button type="submit" name="myAction" value="save">Save</button>
 </form>
 ```
A user's click to the "Save" button results in: 
```
{
    "myAction":"save"
}
```

## Data types

F2j converts the string literals `"true"` and `"false"` to the boolean values `true` and `false` before submission and numeric string values like `"5"` and `"3.4"` to unquoted numbers `5` and `3.4`. User-defined inputs `<textarea>` and `<input type="text">` will not be type converted and will always be sent as strings.

## Callbacks after form submission
Callbacks can be passed to `f2j`:
```
<script>
function mySuccessCallback(data) {
    console.log(data)
}
function myErrorCallback(data) {
    alert(data)
}
<form action="/my/json/api" onsubmit="return f2j(this, mySuccessCallback, myErrorCallback)">
       <button type="submit" name="myAction" value="continue">Continue</button>
</form>
```

## Requests with POST, PUT, PATCH, and DELETE

F2j supports all HTTP methods and defaults to POST. To use PUT, PATCH, DELETE, or other HTTP verbs, pass the desired HTTP method string as the 4th argument. You may pass either upper or lower case:

```
<form action="/my/json/api" onsubmit="return f2j(this, successCallback, errorCallback, 'patch')">
    ...
</form>
``` 

## Sources

The following sources served as the basis for creating `f2j`:

- W3schools AJAX introduction: https://www.w3schools.com/xml/ajax_intro.asp
- Dov Amir's Stack Overflow post: https://stackoverflow.com/a/8567149
- Chris Ferdinandi's blog https://vanillajstoolkit.com/helpers/serializearray/