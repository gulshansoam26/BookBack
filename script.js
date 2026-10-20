const container = document.querySelector(".grid");
const form = document.querySelector("form");
const categories = ["fiction", "science", "entrance", "others"];


let books =[];
async function getBooks() {
    try{
    const res =await axios.get("http://localhost:3000/books");
    books =res.data;
    renderBook(books)
    
    }catch(err){
        console.log("Error fetching: ",err);
    }
    
}

 getBooks();

 
 let currentCategory = "";
 function filterBook(cat){
    if (cat !== "") currentCategory = cat;
    let isFound = false;
    const filtered=[];
    const search = document.querySelector("#search").value.trim().toLowerCase();
    container.innerHTML = "";
     books.forEach(book => {
        const matchesSearch = book.title.toLowerCase().includes(search);
        const matchesCategory = cat === "" || book.category.toLowerCase() === cat.toLowerCase();
        if (matchesSearch && matchesCategory) {
            isFound = true;
            // renderBook([book]);
            filtered.push(book);
        }
    });
    if(!isFound){
        container.innerHTML = "<p>No books found</p>";
    }else renderBook(filtered);
 }


 
document.getElementById("search").addEventListener("input", (e) => {
    filterBook(""); // use existing category
});


categories.forEach(category => {
  document.getElementById(`${category}Filter`)
    .addEventListener("click", () => filterBook(category));
});


function renderBook(books){
    books.forEach(book => {
        const column = document.createElement("div");
        column.classList = "col-6 col-lg-4"
column.innerHTML= `
                         <div class="card shadow bg-light border 0  h-100">
                            <img src="${book.image}"  alt="physics_ncert" style=" object-fit: contain; height: 120px;" >
                                <div class="card-body text-center">
                                    <h5 class="card-title"> ${book.title}</h5>
                                    <p >Author: ${book.author}</p>
                                <div class="d-flex  justify-content-around"><p class="category">${book.category}</p>
                                  <p class=" category" id="status">${book.status}</p>
                                </div>
                                <p>Contact: ${book.contact}</p>
                                <button id="requestBtn" type="button" class="  border rounded bg-primary text-white fw-bold  p-2 commonGradient">Request</button>
                                </div>
                        </div>`;


container.appendChild(column)
    });

    getCard();
}


form.addEventListener("submit",async function(e){
     e.preventDefault();
     const title = form.querySelector("#book-title").value.trim();
     const author = form.querySelector("#author").value.trim();
     const category = form.querySelector("#category").value.trim();
     const contact = form.querySelector("#contact").value.trim();
     const url = form.querySelector("#image").value.trim();
     const donor = form.querySelector("#donor").value.trim();

     if(!title || !author || !category || !contact || !url || !donor){
        alert("All fileds are mandatory");
        return;
     }

     if(isNaN(contact) || contact.length != 10){
        alert("Invalid Contact number");
        return;
     }

     const book ={
        title : title,
        author : author,
        category : category,
        contact : contact,
        image : url,
        donor : donor,
        status : "available"
     }
        try{
        await axios.post("http://localhost:3000/books",book);
        alert("You book is listed successfully");
        form.reset();
     
        }catch(err){
            console.log("Error saving : ",err);
        }
})


function getCard(){
    const cards = document.querySelectorAll(".card");
    cards.forEach(card=> {
        const btn = card.querySelector("#requestBtn");
        const status = card.querySelector("#status")
        btn.addEventListener("click",()=>{
            status.textContent = "Unavailable"
            status.classList.add("bg-danger", "text-white")
            btn.disabled = true;
            btn.style.display= "none"
        })
    })
}

