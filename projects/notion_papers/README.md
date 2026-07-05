# Geomechanical Simulation Sandbox for Spatial Vibration Mechanics (V8)

This repository hosts the supplementary interactive simulation sandbox for **"Mechanics of Spatial Vibration I: A Geomechanical Reinterpretation of Wave-Particle Duality and Phase Turbulence in Quantum Decoherence" (Version 8)**.

The simulator serves as a computational proof of the topological and thermodynamic claims made in the paper.

## Mathematical Mapping & Features

The simulation sandbox consists of five main panels, each mapping directly to mathematical sections of the manuscript:

1. **Nodal Singularity Resolution (Eq. 4):**
   Visualizes the cancelation of the divergent spatial vibration potential $Q_s = -\frac{\hbar^2}{2m}\frac{\nabla^2 R}{R}$ at nodal points ($R \to 0$) by the centrifugal phase barrier $V_c = \frac{L^2}{2m r^2}$, maintaining a smooth, non-divergent total energy landscape:
   $$E_{total}(r) = Q_s(r) + V_c(r)$$

2. **Gauge Invariance & Energy Dissipation (Eq. 17):**
   Demonstrates the action of the gauge-invariant non-linear viscosity term $+\gamma(S - \langle S \rangle)$ on the Schrödinger equation. Users can adjust the friction coefficient $\gamma$ to verify that while global probability density is strictly conserved, the total Hamiltonian energy $H(t)$ undergoes smooth relaxation to the ground state.

3. **Phase Turbulence Vector Field (Section 5.1):**
   Visualizes the velocity field $\mathbf{v} = \nabla S / m$ as a dynamic vector grid. Increasing the measurement perturbation energy $E_{obs}$ injects high-frequency phase fluctuations, turning the coherent wave-fronts into phase turbulence and showing the deterministic origin of trajectory decoherence.

4. **Tensor-Thermodynamic Scaling Law (Section 5.2):**
   Validates the scaling relation of the decoherence time scale $\tau_{dec}$ against the vacuum temperature $T_{vac}$. The dashboard overlays simulated decay times over the theoretical curve:
   $$\tau_{dec} \propto T_{vac}^{-2}$$

5. **Topological Phase Tubes (Section 5.3):**
   Renders the 3D multi-connected geometry of quantum entanglement. The entangled particles are bound by a physical phase tube (wormhole-like junction) in 3D space, showing how local displacement propagates topological phase waves strictly within causality limits ($v \le c$).

## Citing this Work

If you find this simulation sandbox useful in your research, please cite it using the following Zenodo DOI:
```bibtex
@software{yoo2026spatial_vibration_sim,
  author       = {Yoo, Kwang yong},
  title        = {Deterministic Geomechanical Simulation Sandbox for Spatial Vibration Mechanics},
  month        = jul,
  year         = 2026,
  publisher    = {Zenodo},
  version      = {v1.0-paper-final},
  doi          = {10.5281/zenodo.10998822}
}
```
