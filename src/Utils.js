const localDB = {
	
	addUpdateItem(name, data){
		localStorage.setItem(name,JSON.stringify(data));
	},
	
	getItem(name){
		var data = localStorage.getItem(name);
		return (data && JSON.parse(data)) || [];
	},
	
	removeItem(name){
		localStorage.removeItem(name);
	},
	
	clear(){
		localStorage.clear();
	}
}

export default localDB;

