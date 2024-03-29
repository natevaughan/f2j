var f2j = (function() {
    var undefinedType = 'undefined';

    function rest(method, path, successCallback, errorCallback, headers, body) {
        var xhr = new XMLHttpRequest;
        xhr.onreadystatechange = function() {
            4 === xhr.readyState && ((200 <= xhr.status && 299 >= xhr.status) ? successCallback((xhr.responseText !== '' ? JSON.parse(xhr.responseText) : '')) : errorCallback((xhr.responseText !== '' ? JSON.parse(xhr.responseText) : '')))
        };
        xhr.open(method.toUpperCase(), path, !0);
        if (typeof headers === 'object') {
            var propNames = Object.getOwnPropertyNames(headers);
            propNames.forEach(function(name) {
                xhr.setRequestHeader(name, headers[name]);
            });
        }
        if (typeof body !== undefinedType) {
            xhr.setRequestHeader('content-type', 'application/json');
            xhr.send(JSON.stringify(body));
        } else {
            xhr.send()
        }
    }

    function getTypedValue(type, value) {
        // if type is user-defined input, send as string
        if (type === 'textarea' || type === 'text') {
            return value
        }
        if (value === 'true') {
            return true
        }
        if (value === 'false') {
            return false
        }
        var numberValue = Number(value)
        if (!Number.isNaN(numberValue)) {
            return numberValue
        }
        return value
    }


    /*!
     * adapted from Chris Ferdinandi
     * https://vanillajstoolkit.com/helpers/serializearray/
     * serializes an object representation of the form
     */
    serializeArray = function (form) {

        // Setup our serialized data
        var serialized = {};

        // Loop through each field in the form
        for (var i = 0; i < form.elements.length; i++) {

            var field = form.elements[i];

            // Don't serialize fields without a name, submits, file and reset inputs, and disabled fields
            if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset') continue;

            // If a multi-select, get all selections
            if (field.type === 'select-multiple') {
                for (var n = 0; n < field.options.length; n++) {
                    if (!field.options[n].selected) continue;
                    if (Array.isArray(serialized[field.name])) {
                        serialized[field.name].push(field.options[n].value)
                    } else {
                        serialized[field.name] = [field.options[n].value]
                    }
                }
            }

            // Convert field data to object properties
            else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                var value = getTypedValue(field.type, field.value)
                if (Array.isArray(serialized[field.name])) {
                    serialized[field.name].push(value)
                } else if (typeof serialized[field.name] === undefinedType
                    // never send 'checkbox' fields as individual values
                    && field.type !== 'checkbox') {
                    serialized[field.name] = value
                } else {
                    serialized[field.name] = [value]
                }
            }
        }

        return serialized;
    };
    var noop = function() {};

    return function(form, successCallback, errorCallback, method) {
        if (typeof successCallback === undefinedType) {
            successCallback = noop
        }
        if (typeof errorCallback === undefinedType) {
            errorCallback = noop
        }
        if (typeof method === undefinedType) {
            method = 'POST'
        }
        rest(method, form.action, successCallback, errorCallback, {}, serializeArray(form));
        return false
    };
})();