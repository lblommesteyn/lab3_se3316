let globalHeroData = [];
let globalPowersData = [];
let globalSearchResults = [];
let globalListText;
const request = document.getElementById('requested');

//Displaying heros
function results(list){
    list.forEach(hero => {
        // Create the list item
        const card = document.createElement('li');
        card.className = 'card';

        // Create and append the h2 element for name
        const name = document.createElement('h2');
        name.textContent = hero.name;
        card.appendChild(name);

        // Iterate over the hero properties
        const properties = ['id','Gender', 'Eye color', 'Race', 'Hair color', 'Height', 'Publisher', 'Skin color', 'Alignment', 'Weight'];
        properties.forEach(prop => {
          const p = document.createElement('p');
          // Some properties need to access hero object with bracket notation because of the space in key names
          p.textContent = `${prop}: ${prop.includes(" ") ? hero[prop] : hero[prop.replace(" ", "")]}`;
          card.appendChild(p);
        });

        // Correct the unit for height and weight
        card.querySelector('p:nth-of-type(6)').textContent += ' cm';
        card.querySelector('p:last-of-type').textContent += ' lbs';

        // Append the card to the container
        document.getElementById('superheroCards').appendChild(card);
      });
}


//Populating a global heros list (AJAX)
function getHeroList() {
    return fetch('/api/heros/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            globalHeroData = data; // Store the data globally
            return data; // Return the data for further processing
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}


//Populating a power heros list (AJAX)
function getPowerList() {
    return fetch('/api/powers')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            globalPowersData = data; // Store the data globally
            return data; // Return the data for further processing
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

getPowerList();
getHeroList();

//http://localhost:3000/api/search/name/a?n=2


function search(field, query, n) {
    return fetch(`/api/search/${field}/${query}?n=${n}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data =>{
            globalSearchResults = data;
            return data;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        })
}
function createList(listName) {
    let lname = listName;
    console.log("function called");
    return fetch('http://localhost:3000/api/lists', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listName: listName }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`);
        }
        request.innerHTML = lname+" list created";
        return console.log(response);
    });
}

function getList(listName) {
    let lname = listName;
    return fetch(`http://localhost:3000/api/lists/information/${listName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            request.innerHTML = lname;
            updateListView(data); // Call a function to update the HTML content
            return data;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function deleteList(listName) {
    let lname = listName;
    return fetch(`http://localhost:3000/api/lists/${listName}`, {
        method: 'DELETE', // Specify the method to use
        headers: {
            'Content-Type': 'application/json',
        },
        // No body is needed for a delete request
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`);
        }
        request.innerHTML = lname+" list deleted";
        return console.log(response);
    })
    .then(data => {
        console.log('List deleted:', data);
        // Perform any additional actions after deletion here, like updating the UI
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}



function editList(listName, contentString){
    let lname = listName;
    let contentArray;
    try {
      contentArray = JSON.parse(contentString);
    } catch (error) {
      console.error('Error parsing content string:', error);
      return;
    }

    // Create the payload object with the parsed array
    const payload = {
      superheroIds: contentArray
    };

    // Fetch call with the payload
    return fetch(`http://localhost:3000/api/lists/${listName}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Send the payload as JSON
      })
      .then(response => {
        request.innerHTML = lname+" list edited. To view, click view.";
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return console.log(response);
      })
      .catch(error =>{
        console.error('Error during list update:', error);
      });
  }


  function updateListView(listData) {
    const listView = document.getElementById('listView');
    listView.innerHTML = ''; // Clear existing content

    listData.forEach(item => {
        const hero = item.hero;
        const power = item.power;

        // Create the card element
        const card = document.createElement('div');
        card.className = 'card';

        // Create and append the h2 element for the name
        const name = document.createElement('h2');
        name.textContent = hero.name;
        card.appendChild(name);

        // Iterate over hero properties
        const properties = ['id', 'Gender', 'Eye color', 'Race', 'Hair color', 'Height', 'Publisher', 'Skin color', 'Alignment', 'Weight'];
        properties.forEach(prop => {
            const p = document.createElement('p');
            let value = hero[prop.replace(" ", "")] || hero[prop]; // Adjust for properties with spaces
            if (prop === 'Height') {
                value += ' cm';
            } else if (prop === 'Weight') {
                value += ' kg';
            }
            p.textContent = `${prop}: ${value}`;
            card.appendChild(p);
        });

        // Add powers list
        const ul = document.createElement('ul');
        ul.className = 'hero-powers';
        for (const [key, value] of Object.entries(power)) {
            if (value === "True") {
                const li = document.createElement('li');
                li.textContent = key;
                ul.appendChild(li);
            }
        }
        card.appendChild(ul);

        // Append the card to the listView container
        listView.appendChild(card);
    });
}



document.getElementById('search-button').addEventListener('click', async function () {
    const button = this;
    button.disabled = true;
    // Clear the previous results
    document.getElementById('superheroCards').innerHTML = ''; // Clear the previous results
    listView.innerHTML = '';

    const searchCategory = document.getElementById('search-category').value;
    const searchValue = document.getElementById('search-input').value.trim();
    const searchNumber = Number(document.getElementById('search-number').value.trim().toLowerCase());

    if (searchValue === '') {
        return; // Early return if searchValue is invalid
    }

    try {
        let filteredHeros = [];
        if (searchCategory === 'id' && !isNaN(searchValue)) {
            filteredHeros = await search(searchCategory, searchValue, searchNumber);
        }
        if (searchCategory === 'race') {
            filteredHeros = await search('Race', searchValue, searchNumber);
        }
        if (searchCategory === 'name') {
            filteredHeros = await search(searchCategory, searchValue, searchNumber);
        }
        if (searchCategory === 'publisher') {
            filteredHeros = await search('Publisher', searchValue, searchNumber);
        }
        if (searchCategory === 'power'){
            const filteredHerosByPower = globalPowersData.filter(hero => hero[searchValue] === "True");
            const heroNames = filteredHerosByPower.map(hero => hero.hero_names);
            const lowercaseHeroNames = heroNames.map(name => name.toLowerCase());
            filteredHeros = globalHeroData.filter(hero => hero.name.includes(lowercaseHeroNames));
        }
        results(filteredHeros);
    } catch (error) {
        console.error('Search failed:', error);
    } finally {
        button.disabled = false; // Re-enable the button after the search is complete
    }

});


document.getElementById('list-button').addEventListener('click', function () {
    const button = this;
    console.log("button clicked");

    const textValue = document.getElementById('list-input').value.trim().toLowerCase();
    const infoValue = document.getElementById('list-content').value.trim();
    const selectedFunction = document.getElementById('list-category').value.trim();
    const listText = document.getElementById('listView');

    console.log(textValue)
    document.innerHTML = '';// Clear the previous results

    if (textValue === '') {
        return; // Early return if searchValue is invalid
    }

    if (selectedFunction === 'create') {
        // Disable the button to prevent multiple submissions
        button.disabled = true;
        createList(textValue,infoValue)
            .then(list => {
                console.log('List created:', list);
                // Handle successful list creation here
            })
            .catch(error => {
                console.error('List creation failed:', error);
                // Handle errors here, error.status will give the HTTP status code
                if (error.status === 400) {
                    // Handle a bad request, such as a duplicate list name
                }
            })
            .finally(() => {
                button.disabled = false; // Re-enable the button
            });
        }

        if (selectedFunction === 'edit'){
            button.disabled = true;
            editList(textValue,infoValue)

            .then(list => {
                console.log('List edited:', list)
            })
            .catch(error => {
                console.error('List edit failed:',error);

                if (error.status === 400){
                    //Handle a bad request, such as a duplicate list name
                }
            })
            .finally(() => {
                button.disabled = false;
            });
        }


        if (selectedFunction === 'view' ){
            listText.innerHTML = ''; // Clear the previous results
            button.disabled = true;
            getList(textValue)
        }


        if (selectedFunction == 'delete'){
            button.disabled = true;
            deleteList(textValue)
            .then(list => {
                console.log('List deleted:', list);
                request.innerHTML = 'List deleted';
            })
            .catch(error => {
                console.error('List delete failed:', error);
            })
            .finally(() => {
                button.disabled = false;
            });
        }

});