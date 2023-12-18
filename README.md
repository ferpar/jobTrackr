# UI Architecture Final Project
This is the final project made by student Fernando Pérez de Ayala for the UI Architecture Academy.

## local setup
The project was built under node version 16.20, therefore please use a version equal or later than that.

node version >= 16.20 .

Don't forget to install the dependencies on the first time ;).

first time:
```npm install && npm run dev```

afterwards:
```npm run dev```

## running the tests
```npm run test```

## additional considerations

### Lifecycle of architectural components (Singletons / Transients)
- All Gateways are Transients
- All Repositories are Singletons as it is to be expected
- The Authors Presenter is a Singleton as instructed
- Every other Part of the Reactive Core is a Transient by default

### Authors Feature Particularities
- To reuse the BookListPresenter a separate book-list and a flag variable "bufferMode" was created at the BooksRepository so as to not mix an array storing data from the api, with that of an input from the UI. Whenever the AuthorsPresenter is loaded, we set the variable to true so that the BookListPresenter reads from the "buffer" array instead of the list of books coming from the API.

### Routing and Initialization
- The Books Repository is being loaded / reset via the Router
- The Authors Repository and Presenter are being loaded / reset via React.useEffect as instructed on the exercise. Personally, I would rather keep doing this in the Router
- The "before" hook provided by Navigo has been used instead of the "uses" property. But this currently has no effect because we are not "awaiting" for it to end before switching the route. This was intentional, for the matter of not overcomplicating the exercise, but the purpose is to explore the possibility of making sure some processes are finished before we switch a route. To see this in action it will suffice to set async/await on the chain of actions related to the before hook, and its contents.

### CSS and components
Since the exercise is not about CSS/HTML I took the liberty not to follow the same CSS template provided.