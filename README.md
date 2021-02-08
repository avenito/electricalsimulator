# Electrical Simulator

The idea of this project is to teach about electrical systems and electrical protection.

## Tools/Frameworks/Languages

- Bootstrap
- HTML5
- PHP
- Javascript

## Motivation

I taught about electrical systems and electrical protection and believed it was very annoying to (just) talk about theory in the classroom. After some research, I found [Elplek](https://www.google.com/search?channel=fs&client=ubuntu&q=elplek+software) software that is very very good but wanted something simpler for the students. So, I decided to write a simple electrical simulator.

## How it works

### Layout

  <ins>Unifilar</ins>

  The first tab shows the unifilar electrical circuit with the protective relays represented by the [ANSI](https://en.wikipedia.org/wiki/ANSI_device_numbers) device numbers protection functions. It is a SVG picture that the javascript change the properties like color and displayed values. Beside (or below) there are the boxes to control: input circuit breaker (DJE), input voltage, secondary transformer circuit breaker, circuit breaker and power of load 01,  circuit breaker and power of load 02,  circuit breaker and power of the motor, short circuit simulations, and generator operation.
  
  <ins>Components</ins>

  The second tab shows the electrical components parameters. Changing the parameter here, the values are automatically updated to the first tab.

  <ins>Protection</ins>

  This tab has the protective relays parameters (to do).

  <ins>Simulation</ins>

  It is possible to select and start the simulation from this tab (to do).

  <ins>About</ins>

  Information about the project.

### Components interaction

Any click on the HTML elements calls the javascript to recalculate the circuit and update the unifilar picture.

## To do list

There is a lot of work to be done.

1. I started writing it in Portuguese (my mother language), then the first thing in the list is to translate every label to English.
1. Support to multi-language.
1. Rewrite the code using pattern to improve the maintenance and update.
1. Isert protection curves.
1. Simulate the protective functions.
1. Implement the simulation functions on tab "Simulations"
