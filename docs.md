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

# Application Internal Object Structure

1. App. Main application object at the top of the hierarchy.
2. Model. An application primary subcomponent that defines a data structure. It defines data storage for it's model and provides a form and fields for managing model records.
3. Form. A group of fields that relates to a single model. Child of a model. Parent to fields.
4. Field. A singular application field that is grouped into an app form. Child of a form.

# Internal F2 Software Processes

## Saving Records

Record saves are achieved through PUT calls to the model collection endpoint. The endpoint is created automatically via the Post Type registration.

In main.js::formProcessor(model) both the protocol is set to PUT when an object ID is present in the application form.

## Rendering Record Collections

In main.js::renderRecords(modelKey) renders records from the model data store into the model's respective DOM container.

## Editing Records
The edit process starts with a click on an edit button. The edit buttons passes the model key and object ID into the edit click handler.

## Delete Record
The delete process starts with a click on a delete button. The delete button passes the model key and object ID into the delete click handler.

See main.js::deleteClick().

# Field Types

1. Text (text). Provides a text input. Used for short length text.
2. Select (select). Provides an HTML5 selector. Select field type provides an extra setting field "choices".
3. Post Select (post_select). Provides a list of posts to select.
4. Image (image). Provides a field for uploading images.
5. Media File (media_file). Provides a field for uploading files including images to the WordPress media.
6. User Select (user_select). Provides a field for selecting a WordPress user account.
7. User Role Select (user_role_select). Provides a field for selecting a registered WordPress user role.
8. Taxonomy Select (taxonomy_select). Provides a field for selecting a registered WordPress taxonomy.
9. Taxonomy Term Select (taxonomy_term_select). Provides a field for selecting a term from one or more registered WordPress taxonomies.
10. Post Type Select (post_type_select). Provides a field for selecting a registered WordPress post type.
11. Page Select. Provides a field for selecting a WordPress page. Differs slightly from Post Select in presentation and is focused on page selection.
12. Code (code). Provides a code editor for input of code snippets.
13. WYSIWYG (wysiwyg). Provides a WYSIWYG editor for rich text input.
14. Date Select. Provides a field for date selection.
15. Time Select. Provides a field for time selection.
16. DateTime Select (datetime_select). Provides a field for date and time selection in a single field.
17. TextArea (textarea). Provides a textarea HTML5 input field.
18. Record Select (record_select). Selector field for F2 records stored in custom database tables.
19. Record Type Select (record_type_select). Selector field for registered F2 record types (custom database record types).
20. Password (password). Provides a password entry field with obscuring.
21. Avatar (avatar). Provides a field with upload image capabilities and special processing to resize and scale images to create an avatar.
22. Country Select (country_select). Provides a country selection based on an official index of countries with 2-digit country code reference.
23. Credit Card Number (credit_card_number). Provides a credit card number entry field with bit masking for entry validation of valid credit card numbers.
24. Credit Card Security Code (credit_card_security_code). Provides an input for credit card 3-digit security codes with input masking for valid entry.
25. Credit Card Expiry (credit_card_expiry). Provides an input field for credit card expiry dates with input mask for valid entry.
26. S3 File Upload (s3_file_upload). Provides a file uploader that integrates with the Amazon S3 storage service to push files into an S3 folder.
27. XY axis (xy_axis). Visual selector that provides an XY 2d axis selector. Stores selected coordinates from the visual selection of XY-axis points.
28. Rating (rating). Provides a numeric rating selector. Defaults to a 1-5 range and enables custom ranges such as 1-10, 1-100. Stores the singular selected value within the range options.
29. Range (range). Provides a numeric range selector in a single field with input controls for the start and end points. Stores start and end range points selected.
30. Field Type Selector (field_type_selector). Provides a selector for registered F2 field types. Developers and plugins can extend this list through custom F2 Field Type registration.
31. IP Address (ip_address). Provides masked input for IP addresses.
32. Currency Select (currency_select). Provides a selection list of currencies. Shows an official list of known currencies by default. Can be configured to show a subset of currency codes.
33. Language Select (language_select). Provides a selection list of languages. Requires configuration of languages for selection.
34. True False (true_false). Boolean true false toggle switch.
35. Tab Choice (tab_choice). Provides a set of tabs with singular choice highlighting.
36. Tab Multiple Choice (tab_multiple_choice). Provides a set of tabs with multiple choices enabled. The number of selections can be limited to a maximum number. An optional select/unselect all option can be rendered as part of the tab set.
37. Gallery (gallery). Enables multiple image selection to power a gallery of images.
38. Number (number). Entry field for numbers. Provides optional entry masks for a variety of number formats.

# Object Models

## Choices
Choices objects provide a list of options for a choice type field including select.

Example of choices in JSON:

	[{"value":1,"label":"Author 1"},{"value":2,"label":"Author 2"}]

# Schemas

## App Schema

models array of model objects.

## Model Schema

key - Unique identifier.
name - Name of the model.

## Form Schema

key - Unique identifier.
fields - array of field objects.

## Field Schema

key (required)
type a field type object.
typeKey - single unique identifier string for the type

# Javascript Function Reference

## f2.init()

Get the appEl node. Stash this into f2.appEl. If that node does not exist, exit because there is no F2 app loaded.
Set the app ID from the app element.

Loop over the model data contained in f2app.models. f2app models is the JSON representation of the entire app structure.

 Setup app screens. f2.screensInit(), f2.screensMake(). Show the screen dashboard by default with "screen" object function call.

 Loop over the models and do a setup routine for each one.

 1. f2.modelContainerCreate()
 2. f2.modelRender(model)
 3. f2.makeCollectionContainer(model)
 4. f2.recordsChangeHandler(model)

 ## f2.renderField()

 # Known Issues

 After a new Post Type is registered from an F2 app model, the permalinks need to be flushed otherwise certain features of the post type may not work. This may be why at times wp.api.models does not include the new post type model.
