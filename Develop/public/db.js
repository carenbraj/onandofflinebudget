let db;
// create db request for a "budget" database
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    // create object store called "pending" and set autoIncrement to true
    db.createObjectStore("pending", { autoIncrement: true });
};

request.onerror = function(event) {
    db = event.target.result;
    console.log("There was an error");
};

request.onsuccess = function(event) {
    db = event.target.result;
    // check if app is online before reading db
    if (navigator.onLine) {
        checkDatabase();
    }
};

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const pendingStore = transaction.objectStore("pending");

    pendingStore.add(record);
}

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const pendingStore = transaction.objectStore("pending");
    const getAll = pendingStore.getAll();

    getAll.onsuccess = function() {
        if (getAll,result.length > 0) {
            fetch("api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json()
            .then(() => {
                // open transaction in pending db
                const transaction = db.transaction(["pending"], "readwrite");
                // access pending items
                const pendingStore = transaction.objectStore("pending");
                // clear items in your store
                pendingStore.clear();
            })
        }
    };
}
function deletePending() {
    const transaction = db.transaction(["pending"], "readwrite");
    const pendingStore = transaction.objectStore("pending");
    pendingStore.clear();
  }

window.addEventListener("online", checkDatabase);


