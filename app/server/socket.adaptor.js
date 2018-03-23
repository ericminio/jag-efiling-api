var SaveFormTwo = require('../features/save.form.2');
var SearchFormSeven = require('../features/search.form.7');

var SocketAdaptor = function() {
    this.renderSearchFormSevenResult = function(data, callback) { callback({ parties: data }); };
    this.renderSaveFormTwoResult = function(data, callback) { callback({ status:201, id:data }); };
};

SocketAdaptor.prototype.useService = function(service) { this.searchFormSeven = new SearchFormSeven(service); };
SocketAdaptor.prototype.useTokenValidator = function(tokenValidator) { this.tokenValidator = tokenValidator; };
SocketAdaptor.prototype.useDatabase = function(database) { this.saveFormTwo = new  SaveFormTwo(database); };

SocketAdaptor.prototype.connect = function(socket) {
    this.secure(socket, 'form-7-search', this.searchFormSeven, this.renderSearchFormSevenResult);
    this.secure(socket, 'form-2-save', this.saveFormTwo, this.renderSaveFormTwoResult);
};

SocketAdaptor.prototype.secure = function(socket, message, service, render) {
    socket.on(message, (params, callback) => {
        this.tokenValidator.validate(params.token, (isValid) => {
            if (!isValid) {
                callback(undefined);
            } else {
                service.now(params, function(data) {
                    render(data, callback);
                });
            }
        });
    });
};

module.exports = SocketAdaptor;