# Proof of the Explicit Formula for the Fibonacci Sequence (Binet's Formula)

**Goal:** To prove Binet's Formula, which states that the $n$-th term of the Fibonacci sequence is given by:
$$F_n = \frac{\phi^n - \psi^n}{\sqrt{5}}$$

Where:
* $\phi = \frac{1 + \sqrt{5}}{2} \approx 1.6180339...$ (The Golden Ratio)
* $\psi = \frac{1 - \sqrt{5}}{2} = -\frac{1}{\phi} \approx -0.6180339...$

## Step 1: Definition of the Sequence and Recursion
The Fibonacci sequence is defined by the following recursive relation:
$$F_n = F_{n-1} + F_{n-2}$$

This can be rewritten in the form of a homogeneous equation:
$$F_n - F_{n-1} - F_{n-2} = 0$$

## Step 2: Assuming an Exponential Solution
We assume a solution of the form (for any number $\lambda \neq 0$):
$$F_n = \lambda^n$$

Substitute this assumption into the recursion equation:
$$\lambda^n = \lambda^{n-1} + \lambda^{n-2}$$

Divide the entire equation by $\lambda^{n-2}$ (assuming $\lambda \neq 0$):
$$\lambda^2 = \lambda + 1$$
$$\lambda^2 - \lambda - 1 = 0$$

## Step 3: Solving the Characteristic Equation
We find the roots of the quadratic equation using the quadratic formula:
$$\lambda_{1,2} = \frac{-(-1) \pm \sqrt{(-1)^2 - 4 \cdot 1 \cdot (-1)}}{2 \cdot 1} = \frac{1 \pm \sqrt{1 + 4}}{2} = \frac{1 \pm \sqrt{5}}{2}$$

We obtained two roots, which are exactly the Golden Ratio and its conjugate:
$$\phi = \frac{1 + \sqrt{5}}{2}, \quad \psi = \frac{1 - \sqrt{5}}{2}$$

## Step 4: Linear Combination of the Solutions
Since we are dealing with a homogeneous linear equation, the general solution is a linear combination of the two roots we found:
$$F_n = A \cdot \phi^n + B \cdot \psi^n$$

## Step 5: Finding the Coefficients A and B using Initial Conditions
We use the known initial conditions of the sequence:
* $F_0 = 0$
* $F_1 = 1$

Substitute $n = 0$:
$$F_0 = A \cdot \phi^0 + B \cdot \psi^0 = A + B = 0 \implies A = -B$$

Substitute $n = 1$:
$$F_1 = A \cdot \phi^1 + B \cdot \psi^1 = A\phi + B\psi = 1$$

Substitute $A = -B$ into the second equation:
$$-B\phi + B\psi = 1 \implies B(\psi - \phi) = 1$$

Calculate the difference $\psi - \phi$:
$$\psi - \phi = \frac{1 - \sqrt{5}}{2} - \frac{1 + \sqrt{5}}{2} = \frac{1 - \sqrt{5} - 1 - \sqrt{5}}{2} = \frac{-2\sqrt{5}}{2} = -\sqrt{5}$$

Therefore:
$$B(-\sqrt{5}) = 1 \implies B = -\frac{1}{\sqrt{5}}$$

And since $A = -B$:
$$A = \frac{1}{\sqrt{5}}$$

## Step 6: Obtaining the Final Formula
Substitute the values of $A$ and $B$ into the general solution:
$$F_n = \frac{1}{\sqrt{5}} \cdot \phi^n - \frac{1}{\sqrt{5}} \cdot \psi^n = \frac{\phi^n - \psi^n}{\sqrt{5}}$$