# F2 WordPress Plugin Docs

## App Basic Definition

The most simplistic form of app creation involves this short series of steps.

1. A new and empty App() object is instantiated.
2. A new Form() object is instantiated.
3. For each field in the schema of the object(s) a FieldGroup is instantiated and Field() and (optional) Label() objects are nested into the FieldGroup.
4. All FieldGroup objects are nested into the Form object.
5. Storage for the App is setup using a Storage object which is added to the app with setStorage( $storage ) method.
6. App::storageInit() is called and this triggers the registration of post type(s) and meta fields(s) with REST support.


## Internal WordPress Post Types

F2 registers 3 custom post types: app, form and entry.

## Application Lifecycle Processes

### Loading Process

During initial loading and subsequent refresh loading there is a standardized process that the SPA (Single Page Application) utilizes. This process includes rendering of a loading skeleton to represent the data and UI elements being loaded or populated.

## Dependencies

F2 has no external dependencies. Latest WordPress version or recent version is required to activate F2.

### Internal Dependencies

F2 Apps require the main.js app controller to be enqueued in the footer. 
