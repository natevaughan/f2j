var f2j = (function() {
    var undefinedType = 'undefined';

    function rest(method, path, successCallback, errorCallback, headers, body) {
        var xhr = new XMLHttpRequest;
        xhr.onreadystatechange = function() {
            4 === xhr.readyState && ((200 <= xhr.status && 299 >= xhr.status) ? successCallback((xhr.responseText !== '' ? JSON.parse(xhr.responseText) : '')) : errorCallback(xhr))
        };
        xhr.open(method, path, !0);
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
                    } else if (typeof serialized[field.name] === undefinedType) {
                        serialized[field.name] = field.options[n].value
                    } else {
                        var existing1 = serialized[field.name];
                        serialized[field.name] = [existing1, field.options[n].value]
                    }
                }
            }

            // Convert field data to a query string
            else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                if (Array.isArray(serialized[field.name])) {
                    serialized[field.name].push(field.value)
                } else if (typeof serialized[field.name] === undefinedType) {
                    serialized[field.name] = field.value
                } else {
                    var existing2 = serialized[field.name];
                    serialized[field.name] = [existing2, field.value]
                }
            }
        }

        return serialized;
    };
    var noop = function() {};

    return function(formId, successCallback, errorCallback) {
        if (typeof successCallback === undefinedType) {
            successCallback = noop
        }
        if (typeof errorCallback === undefinedType) {
            errorCallback = noop
        }
        var form = document.getElementById(formId);
        rest(form.method, form.action, successCallback, errorCallback, {}, serializeArray(form));
        return false
    };
})();
