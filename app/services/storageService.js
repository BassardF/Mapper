angular.module('storageServiceModule', ['ngCookies'])

	.service('storage', function($cookieStore) {

		function isLocalStorage(){
			return Modernizr.localstorage;
		}

        this.save = function (key, data) {
			if(isLocalStorage){
				localStorage.setItem(key, data);
			} else {
				$cookieStore.put(key, data);
			}            
        };

        this.saveObject = function (key, data) {
			if(isLocalStorage){
				localStorage.setItem(key, JSON.stringify(data));
			} else {
				$cookieStore.put(key, JSON.stringify(data));
			}            
        };

        this.remove = function (key) {
			if(isLocalStorage){
				localStorage.removeItem(key);
			} else {
				$cookieStore.remove(key);
			}
        };

        this.get = function (key) {
            return isLocalStorage ? localStorage.getItem(key) : $cookieStore.get(key);
        };

        this.getObject = function (key) {
            return isLocalStorage ? JSON.parse(localStorage.getItem(key)) : JSON.parse($cookieStore.get(key));
        };

    })
;