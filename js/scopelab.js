var M = function () {
    var obj = {};
    var arr = [];
    var change = function () {
        obj["key"]="if I see this, O is a reference to obj";
        arr.push("If I see this, A is a reference to arr")
        };
    return {
        change: change,
        O: obj,
        A: arr
        };
}();

M.change();
console.log(M.A); // prints ["If I see this, A is a reference to arr"] 
console.log(M.O); // prints Object {}, wanted "if I see this, O..."