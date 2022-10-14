# free photo stock

An application that that allows you to search for free stock photos online, using an API (using js async-await)

👉 [**Live demo**](http://phpstack-856558-2958294.cloudwaysapps.com/)

![image](https://user-images.githubusercontent.com/45925914/176820517-6da4c843-9564-479d-bc3f-fa05c30987a3.png)

## Technologies

The app is coded with vanilla Javascript.
It uses the Pexels API and AJAX technology.

## Features

This web application allows you to find royalty-free images from simple keywords.
It includes:
- A complete and simple gallery customization system from the Gallery object signature (see video or code on Github): number of columns, thumbnail height, overlay style on mouseover, etc.
- an infinite loading button at the bottom of the page
- a loading spinner

## How to use?

Example of new Gallery object signature:

```js
new Gallery( {
    auth: "PEXELS_API_KEY",
    perPage: 12,
    gap: '40px',
    searchPlaceholder: true,
    showMoreCount: true,
    photo: {
        minWidth: '300px',
        height: '600px',
        overlayStyle: 3,
        overlayColor: 'average',
        overlayOpacity: 0.95,
        animation: 'circleSmall',
        animationDuration: 0.3
    }
})
```
