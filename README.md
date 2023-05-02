# Hydrolic Erosion

A web-based hydrolic erosion simulation that runs in-browser. Created during the 2023 Scientific Computing course taught by [@nugent-lab](https://github.com/nugent-lab) at [@olincollege](https://www.olin.edu) and based off of this [paper](https://www.firespark.de/resources/downloads/implementation%20of%20a%20methode%20for%20hydraulic%20erosion.pdf). [Try it out!](https://olincollege.github.io/scicomp-p4-efisher-erosion/).

![image](https://user-images.githubusercontent.com/26287286/235552107-32dea243-0bdb-45bc-a31a-190c73df29d5.png)

## Setup

These instructions assume you want to run the simulation in a local browser with hot reload. To just run the simulation, use [the deployed version](https://olincollege.github.io/scicomp-p4-efisher-erosion/).

You'll need [Node.JS](https://nodejs.org/en) version 16+ and [npm](https://www.npmjs.com). You can check if you already have these installed:

```bash
node -v
npm -v
```

With these set up, you'll need to install the required packages.

```bash
npm install
```

You'll also need [npx](https://www.npmjs.com/package/npx).

```bash
npm install -g npx
```

Finally, to start the app, run:

```bash
npx vite
```

## Benchmarks

To check the veracity of the simulation, we compare several parameter sweeps to parameter sweeps from the paper. Note: due to the parallel nature of this simulation, the affect of parameters at specific magnitudes are not exactly the same. However, we might expect the effect as we sweep the parameters to be similar.

### Inertia

To start, we look at inertia. Inertia controls how closely the droplets of water follow the gradient of the terrain, where a low inertia means they follow closely, and a high inertia means they tend to stay their original course. When inertia is low, we expect more ravines to form, while when inertia is high, we expect more smooth terrain. Here, we see the expected behavior, with the generated terrain going from more sharp, eroded terrain to more smooth terrain as inertia increases.

![image](https://user-images.githubusercontent.com/26287286/235554766-51c4d93e-afbe-4298-be8a-adaf42ae2450.png)

![image](https://user-images.githubusercontent.com/26287286/235557824-a56fd8fa-fcbd-41cc-aa37-6dfcc5374557.png)

### Carry Capacity

Next, we look at carry capacity. Carry capcity indicates how much sediment a droplet can carry before having to deposit it. At a low carry capacity, we expect smoother terrain as droplets deposit their sediment early, will still on the mountain side. At a high carry capacity, we expect more rugged terrain, as droplets pickup and carry sediment all the way to the flat planes. Here, we again see expected behavior, with the generated terrain going from smoother to more rugged as carry capacity increases.

![image](https://user-images.githubusercontent.com/26287286/235554828-3d6c7076-eaf4-4541-9a53-fe2b72f7104e.png)

![image](https://user-images.githubusercontent.com/26287286/235557656-e369281f-16d5-4d48-8aa5-f41fa92c2912.png)

### Deposition Speed

Deposition speed deterimes how quickly a droplet deposits its excess sediment. Lower values might tend to produce more ravines, as droplets hold onto sediment until they reach flatter terrain or holes to deposit their sediment in. Here, we don't quite see expected behavior. If you squint, the terrain looks slightly smoother for higher deposition rates. However, overall, the difference seems to be at a level explainable by stochasticity.

![image](https://user-images.githubusercontent.com/26287286/235554916-35b46c41-c5bb-4328-9477-65c4af7ebab4.png)

![image](https://user-images.githubusercontent.com/26287286/235558465-d223533c-7d19-4e59-a952-cfb2fc33f9f1.png)

### Erosion Speed

Erosion speed determines how quickly a droplet picks up new sediment. At extremes (close to 0 or 1) we see smoother terrain, as low values produce almost no erosion, and high values fill up on sediment immediately then spend most of their time depositing it. On the other hand, for values in the mid-range, droplets spend the entire trip down a face of a mountain picking up sediment, and thus produce more rugged terrain. Here we again do not see the expected variation across parameter values.

![image](https://user-images.githubusercontent.com/26287286/235554948-34e36bea-9d4f-4da1-be1f-db48c9c92a75.png)

![image](https://user-images.githubusercontent.com/26287286/235559962-5a53cd2f-3a39-4de0-8426-0377c4d1decd.png)

