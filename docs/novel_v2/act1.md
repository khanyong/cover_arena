# ACT 1: THE RETURNING SIGNATURE

## Chapter 1: Atmospheric Exile

### [Scene 1: The Calculus of Isolation]

Three years after Geneva, Ian Yoo had reduced his life to systems that could fail independently.

The observatory had helped.

Coats Observatory stood above Paisley beneath a sky that seemed designed to frustrate astronomy. Atlantic weather arrived in layers: low cloud, rain, wind-driven mist, brief clear intervals, then cloud again. The nineteenth-century dome still dominated the building, but Ian rarely opened it.

He did not need the telescope.

He needed the isolation.

The former instrument workshop had evolved slowly from the improvised laboratory he had built after leaving the NGC. Two second-hand GPU racks had become six. Custom FPGA boards occupied a shielded cabinet beside the original workbench. Local storage arrays filled a steel frame bolted to the masonry wall. A compact cryogenic test rig sat behind a transparent safety partition. Power conditioning, clock distribution, and environmental monitoring had been rebuilt twice.

Nothing connected automatically to the outside world.

Internet access existed through a physically separate terminal in the old public office downstairs. Data entered the laboratory only after being downloaded, checksummed, copied to removable storage, and passed through an isolated staging machine.

No cloud compute.

No remote administration.

No automatic software updates.

No external license server capable of deciding that his analysis should stop because someone else's contract had expired.

Ian called the arrangement independence.

Sarah Hayes, in the two messages she had sent him during the first year, had called it something else.

The first:

You have built a bunker with a telescope on the roof.

The second, six months later:

Isolation is not the same thing as independence. Eventually you will need another instrument.

Ian had not answered either message.

He had preserved them.

That distinction mattered to him.

At 02:14 local time, the observatory's analysis cluster completed another blind pass through fourteen months of archival astrometric data.

Ian was awake.

He was usually awake when the cluster finished.

The room was illuminated only by the low white strips beneath the equipment racks and the primary monitor on the central desk. Rain tapped irregularly against the western windows. The old building responded to stronger gusts with small sounds of expansion and strain: timber, metal, stone.

Ian ignored them.

On the screen, the pipeline displayed the result.

CANDIDATE RESIDUALS: 18,441

He drank cold coffee.

The number meant nothing.

Most candidates would disappear.

Detector artifacts.

Cosmic-ray contamination.

Point-spread-function mismatch.

Unmodeled proper motion.

Parallax.

Image-registration failure.

Persistence.

Background galaxy morphology.

Bad covariance.

Human pattern recognition pretending noise had structure.

Ian trusted none of them.

Especially the last.

He had built the pipeline to distrust him.

The first pass used catalog positions and observatory metadata to predict the expected apparent motion of compact sources across repeated imaging epochs. The software then compared measured centroids against the forward model appropriate to each instrument.

It did not compare images directly.

A JWST image was not an HST image.

Different aperture.

Different wavelength response.

Different detector.

Different point-spread function.

Different distortion model.

Trying to make the images look alike would manufacture agreement.

So Ian reduced each observation to quantities that could survive the instrument change:

source identity.

observation time.

barycentric observer position.

centroid vector.

covariance.

wavelength band.

calibration state.

The basic residual was simple.

$$ \Delta\boldsymbol{\theta}i = \boldsymbol{\theta}{\mathrm{observed},i} - \boldsymbol{\theta}_{\mathrm{model},i} $$

Everything difficult was hidden inside the word model.

Ian began eliminating candidates.

By 02:47, eighteen thousand had become three hundred and twelve.

He removed sources whose residuals correlated with detector position.

Down to one hundred and forty-seven.

He removed epochs affected by known persistence flags.

Eighty-one.

Sources with extended morphology.

Forty-three.

Objects with catalog uncertainty large enough to absorb the apparent displacement.

Nineteen.

Known binaries.

Twelve.

He looked at the remaining list.

Twelve was still too many.

Ian opened the first.

A compact quasar field observed twice by JWST.

The apparent displacement was real enough.

So was the explanation.

A residual distortion term near the detector edge.

Rejected.

The second died under color-dependent centroid shift.

The third under guide-star reconstruction.

The fourth was not the same source in both epochs.

Ian deleted it without irritation.

A failed candidate was useful.

It reduced the space.

At 03:31, four remained.

The fifth had already survived longer than it deserved.

Ian opened it.

A sparse extragalactic field projected toward Perseus.

Nothing about the target itself was unusual. The primary observation program had not been designed to study spacetime, lensing, or astrometry. The field existed in the archive because another team had been studying a distant galaxy population.

Ian had selected it only because several compact background sources provided clean centroid references.

Epoch one.

Epoch two.

Separated by one hundred and seventy-nine days.

He checked the barycentric correction.

Correct.

Observer ephemeris.

Correct.

Instrument distortion solution.

Current.

Guide-star state.

Nominal.

One compact source showed an offset.

So did another.

Then a third.

Not identical offsets.

A pattern.

Ian sat straighter.

He did not enlarge the vectors.

He had learned long ago that magnification could turn nothing into a discovery.

Instead he printed the residual table numerically.

Three compact sources.

Different detector positions.

Different brightness.

Similar displacement direction within covariance.

He checked for a common instrumental axis.

No.

Solar elongation dependence.

No obvious correlation.

Parallax model.

Already included.

Aberration.

Included.

Proper motion.

Negligible at the measured level for the selected extragalactic references.

Ian opened the raw calibrated exposures.

Not because he trusted his eyes.

Because he did not trust the pipeline.

The sources were there.

No visible corruption.

No obvious cosmic-ray event.

No persistence trail.

No saturation.

He returned to the centroid solution.

The residual amplitude was small.

Small enough that a careless analyst could have absorbed it into calibration.

Large enough that three independent compact sources moving in a related direction demanded explanation.

Ian wrote the candidate ID in his notebook.

Then beneath it:

DO NOT INTERPRET.

He reran the reduction using an earlier distortion calibration.

The anomaly weakened.

Not vanished.

He reran it with a later calibration.

The anomaly strengthened slightly.

He removed one source.

The directional solution survived.

Removed another.

Uncertainty widened.

Direction remained.

Ian looked toward the sealed case containing the Sector Four cartridge.

Three years earlier, he would already have opened it.

He did not.

The Geneva data was a contaminant now.

Not physically.

Cognitively.

If he compared the new anomaly against Sector Four before establishing the astronomical result independently, every subsequent choice in the pipeline would be vulnerable to expectation.

He knew what pattern he wanted.

Therefore he was not allowed to look for it yet.

Ian stood and crossed the laboratory.

A whiteboard occupied the far wall.

At the top he wrote:

ASTROMETRIC CANDIDATE A-173

Below:

Independent of Geneva analysis until external replication.

He underlined external.

That was the problem.

There was only one instrument so far.

One telescope.

One reduction family.

One sky field.

Not evidence enough.

At 04:06, he opened the separate network terminal downstairs.

The old public office was colder than the laboratory. Ian kept no permanent heat running there because there was no sensitive equipment worth protecting.

He logged into the public archive interface.

Search:

same field.

different observatory.

earlier epochs.

Hubble had observed a partially overlapping region eleven years earlier.

The filter bands were not identical.

The resolution was different.

The pointing geometry was imperfect.

But several of the compact reference sources remained visible.

Ian requested the datasets.

Download estimate: twenty-three minutes.

He waited.

Not in front of the screen.

That was another habit he had imposed on himself.

Waiting did not accelerate data transfer.

He went upstairs and washed the coffee mug.

The action required ninety seconds.

He cleaned a coolant-filter warning on Rack Four.

Four minutes.

He checked the cryogenic test stand.

Nominal.

Rain intensified.

When he returned downstairs, the download had completed.

He checked the file hashes.

Copied the data to removable storage.

Disconnected it.

Moved upstairs.

Inserted it into the staging machine.

Only after the scan completed did the HST data enter the isolated analysis environment.

The entire process took eleven minutes more than transferring directly over a network would have.

Ian preferred the delay.

Latency was visible.

Dependency was not.

By 05:02, the HST field had been reconstructed into its native astrometric frame.

Ian did not warp it into the JWST image.

He forward-modeled each instrument separately, solved the centroids independently, and transformed only the resulting astrometric quantities into a common barycentric reference frame.

The overlapping sources were faint.

Covariance widened.

One was unusable.

Two survived.

The old HST epoch did not show the same displacement.

It could not.

The anomaly, if real, had developed later.

But the HST data gave him something more important.

A baseline.

Ian fitted the source positions under ordinary proper motion and parallax.

For extragalactic objects, both were effectively negligible at this precision after calibration.

The JWST epoch-one positions remained compatible with the long-baseline HST solution.

Epoch two did not.

He reran the fit.

Same result.

Removed one reference source.

Same direction.

Changed weighting.

Same sign.

A candidate anomaly had acquired a history.

Ian looked at the clock.

05:41.

The first gray light of morning had begun to dilute the darkness outside.

He wrote on the whiteboard:

HST archival baseline: compatible with JWST epoch 1.

Then:

JWST epoch 2: coherent residual across multiple compact sources.

Then, beneath both:

Instrument-independent confirmation: NOT YET.

HST supplied historical geometry.

It did not observe the anomaly contemporaneously.

That distinction prevented him from calling it replication.

He needed another instrument at the same phase of the event.

At 06:03, Ian searched radio astrometry archives.

Most of the optical sources were useless for VLBI.

Wrong radio flux.

Wrong catalog.

Wrong field.

He expanded the search radius.

One compact radio reference source lay close enough to the optical anomaly field to matter.

Not coincident.

Nearby on the sky.

Observed repeatedly as part of a geodetic calibration program.

Ian stopped.

This was better than he had expected.

VLBI measured position through an entirely different physical architecture.

Radio telescopes separated across continents.

Independent clocks.

Independent atmosphere.

Independent detectors.

Independent calibration system.

A shared sky.

If the same spatial anomaly affected that source, it would be difficult to blame JWST optics.

He downloaded the public metadata first.

Not the full dataset.

Observation dates.

The source had been measured during the relevant interval.

Three epochs.

One before the JWST deviation.

Two after.

Ian felt his heart accelerate.

He stopped.

Physiological excitement was not evidence.

He wrote the sentence in the notebook because his father would have hated the fact that he needed to.

Excitement changes thresholds. Freeze analysis criteria before opening values.

He defined the test before downloading the astrometric solution.

The predicted criterion was not:

Does VLBI look like JWST?

Too vague.

Instead:

Fit the VLBI source under its established proper-motion/parallax model.

Compute post-fit residual vectors.

Do not rotate or rescale to match optical data.

Test whether the later residual direction is statistically compatible with the optical anomaly direction within combined covariance.

Record failure if not.

Ian saved the criteria.

Timestamped the file locally.

Then opened the radio astrometry.

Epoch one.

Nominal.

Epoch two.

Offset.

He did not react.

Epoch three.

Offset again.

Same quadrant.

Ian stared at the values.

Not the same amplitude.

They should not necessarily have been.

The angular position relative to the inferred disturbance was different.

What mattered was direction and phase structure.

He ran the covariance test.

The system returned:

COMPATIBILITY WITH OPTICAL RESIDUAL DIRECTION: 2.1 sigma

Ian leaned back.

Weak.

Interesting.

Not enough.

The third epoch improved it.

JOINT DIRECTIONAL COMPATIBILITY: 3.4 sigma

Still not enough.

A paper could be written about 3.4 sigma.

Ian was not interested in a paper.

He was interested in whether the sky had moved.

At 06:47, the old building's heating system activated.

Pipes clicked inside the walls.

Ian flinched at the sound.

He looked toward the whiteboard.

JWST.

HST.

VLBI.

The architecture was emerging.

But architecture was not proof.

He opened a new file.

NULL ENSEMBLE.

If he tested enough sky fields, eventually unrelated residuals would align by chance.

The pipeline had begun with thousands of candidates.

Selection itself carried statistical cost.

Ian constructed a control population from comparable archival fields:

similar source density.

similar astrometric uncertainty.

similar epoch spacing.

similar detector position distribution.

The system would ask a different question.

Not:

How unlikely is this residual under one model?

But:

How often would a pipeline searching this much data discover an alignment at least this convincing by accident?

The computation began.

Estimated completion:

03:48:21.

Ian looked at the time.

Almost seven in the morning.

He could not wait four hours without sleep.

He tried anyway.

At 08:12, Ian woke with his head on the desk.

The cluster was still running.

Rain had stopped.

His neck hurt.

He stood slowly.

The laboratory smelled of electronics and stale coffee.

For several seconds he did not remember why three monitors were filled with astrometric covariance matrices.

Then he did.

The excitement returned.

He suppressed it.

Rack Four reported a temperature warning.

He fixed that first.

At 09:26, the null ensemble completed.

Ian sat.

The result appeared.

CONTROL REALIZATIONS: 100,000

ALIGNMENTS >= CANDIDATE A-173: 417

He stared.

Approximately four cases in a thousand.

Interesting.

Nowhere near discovery.

He felt relief.

That surprised him.

Part of him had wanted the anomaly to disappear.

Because if it disappeared, Geneva could remain beneath Switzerland.

The failed experiment.

The damaged machine.

Sterling's restricted archive.

His exile.

Local.

Contained.

Ian saved the result.

On the whiteboard:

False-alignment rate ~4.2 x 10^-3 under current selection model.

$$ p_{\mathrm{null}} \approx 4.2 \times 10^{-3} $$

Then:

NOT DISCOVERY.

He underlined it twice.

Three weeks passed.

Candidate A-173 remained.

Ian tried to kill it every day.

He expanded the null ensemble.

Reprocessed the JWST exposures from lower-level calibrated products.

Used alternative centroid estimators.

Excluded entire detector regions.

Changed reference catalogs.

Modeled chromatic terms.

Injected synthetic source shifts to test recovery bias.

One implementation bug briefly doubled the apparent significance.

He found it.

Fixed it.

The anomaly weakened.

It did not vanish.

That was better.

He began searching for future observations.

The geometry of the field relative to the Sun limited when JWST could observe it. Continuous six-month monitoring was impossible. The target entered and left practical visibility windows.

HST could fill some epochs.

Ground-based VLBI could supply others.

The measurements would not be simultaneous.

They did not need to be if the anomaly evolved slowly enough.

Ian generated a predicted astrometric trajectory under the simplest phenomenological fit.

He did not yet assign a physical cause.

Only a curve.

If the effect was real, the next accessible optical epoch should shift farther along the same projected direction.

If it returned to baseline, the model failed.

He submitted observing requests.

One was rejected.

One entered a queue.

One received no response.

Ian submitted again with less speculative language.

He did not mention Geneva.

He did not mention spacetime.

He wrote:

Unexpected coherent astrometric residual across compact background references; independent epoch requested for calibration discrimination.

That was true.

It was also more likely to get telescope time.

Two months after the first candidate survived, Ian received an email from an astronomer he had never met.

Dr. Yoo,

Your reduction notes are irritatingly thorough.

Ian read the sentence twice.

Below it:

We repeated the centroid extraction from the publicly available frames without using your residual vectors as priors. We see something in the same direction, but our significance is lower. Before you become excited: I still think this is probably calibration.

The sender was Dr. Elena Marovic, an astrometrist working in Leiden.

Attached:

her reduction summary.

Ian opened it.

Different software.

Different reference selection.

Different centroid method.

Same sign.

Larger uncertainty.

He felt the old urge.

Connect the pattern.

Name it.

Claim it.

He did not.

He replied:

Please do not compare against my modeled trajectory yet. Send only your centroid vectors, timestamps, covariance matrices, and calibration exclusions.

Three minutes later:

That was already my plan.

Ian almost smiled.

That afternoon he wrote a new heading on the whiteboard.

FIRST EXTERNAL REDUCTION

Below:

Compatible. Not decisive.

Then another:

Next requirement: temporal evolution.

The anomaly had survived another observer.

Now it had to survive time.

Four months after Candidate A-173 first appeared, the second JWST visibility window opened.

Ian did not control the telescope.

He did not control the scheduling queue.

He did not control weather at supporting ground stations.

He did not control HST's competing programs.

For the first time in years, the truth he wanted depended on institutions again.

He hated that.

He waited.

One scheduled visit was delayed.

Another executed.

The data did not become public immediately.

Proprietary restrictions covered part of the observation.

Ian requested access through the team.

No response.

He contacted Marovic.

She knew someone on the program.

That person knew the principal investigator.

Emails moved.

Permissions moved.

A week passed.

Ian discovered something he had spent three years trying to avoid.

Isolation had a cost.

He could build compute.

He could build control electronics.

He could preserve local data.

He could not build another JWST.

Sarah had been right.

Eventually, he needed another instrument.

On the one hundred and seventy-sixth day after he first identified A-173, a new astrometric packet arrived.

Not an image.

Marovic sent only what they had agreed.

Centroid vectors.

Observation epochs.

Covariance.

No interpretation.

Ian disconnected the network terminal.

Transferred the data upstairs.

Loaded it into the pipeline.

He did not open the previous predicted curve.

The analysis remained blind.

The new epoch solved.

One source.

Offset.

Second.

Offset.

Third.

Offset.

The vectors aligned.

Ian watched the combined covariance ellipse shrink.

The displacement had increased.

Not arbitrarily.

Along the direction implied by the earlier epochs.

He opened the prediction.

For several seconds, the monitor displayed both.

Observed.

Predicted.

Close.

Not exact.

Close enough that the residual now had temporal structure.

Ian ran the fit.

The cluster returned a periodic component.

Very low frequency.

$$ f \approx 1.2 \times 10^{-7},\mathrm{Hz} $$

Equivalent period:

$$ T \approx 9.6 \times 10^{1},\mathrm{days} $$

Roughly ninety-six days.

Ian did not move.

That number meant something to him.

Not because astronomy predicted it.

Because he had seen a structurally related frequency ratio once before.

In Geneva.

Inside a local FPGA ring buffer.

He looked toward the sealed Sector Four cartridge.

For nearly six months, he had refused to compare them.

The external anomaly now possessed:

multiple optical epochs.

an archival HST baseline.

radio astrometric support.

an independent external reduction.

a temporal signature.

Not proof.

Enough to justify the next test.

Ian stood.

Crossed the room.

Opened the shielded cabinet.

Removed the Sector Four cartridge.

Dust had settled along one edge of the case.

He wiped it away with his thumb.

For three years, the device had contained the last local memory of the machine beneath Geneva.

Until that moment, Ian had treated it as evidence of a past event.

Now he wondered whether it was something else.

A source signature.

Or an echo.

He carried the cartridge to the isolated reader.

Connected it.

The directory appeared.

ACTUATOR COMMAND STREAM

LOCAL PHASE METROLOGY

PROTECTION TELEMETRY

FINAL LOCAL RING BUFFER

Ian placed both hands flat on the desk.

He did not begin the comparison.

Not yet.

First he opened his notebook.

At the top of a clean page he wrote:

PREDICTION BEFORE COMPARISON

Then:

If the astronomical residual and Sector Four share a common dynamical structure, an independently measured frequency ratio and phase relation should survive a single locked global scaling transform.

He paused.

Added:

No free time warping.

No local frequency tuning.

Amplitude and constant phase offset only after global scale is fixed.

He signed the page.

Dated it.

Then he looked at the cartridge.

Outside, cloud moved across Paisley.

Inside, two datasets separated by three light-years of inference waited on the same desk.

For seventeen years, Ian had believed uncertainty was merely a gap between reality and sufficient information.

Geneva had taught him that information could survive without explanation.

The sky was about to test whether the gap had a direction.

### [Scene 2: The Six-Month Correlation]

Ian waited until morning before opening the Sector Four cartridge.

Not because the analysis required daylight.

Because he wanted one night's separation between prediction and comparison.

He slept badly.

At 07:11, he returned to the laboratory, made coffee he forgot to drink, and read the page he had written the night before.

PREDICTION BEFORE COMPARISON

If the astronomical residual and Sector Four share a common dynamical structure, an independently measured frequency ratio and phase relation should survive a single locked global scaling transform.

No free time warping.

No local frequency tuning.

Amplitude and constant phase offset only after global scale is fixed.

Ian read the words twice.

Then he signed beneath them again.

The redundant signature annoyed him.

He left it.

The first comparison failed.

Not dramatically.

That would have been easier.

The Sector Four local phase trace contained less than half a second of useful high-rate data around the stabilization event. The astronomical anomaly evolved over months.

Placing the two waveforms beside one another was meaningless.

The time scales differed by more than nine orders of magnitude.

Ian did not stretch one until it looked like the other.

Instead he decomposed both into dimensionless structure.

Relative mode spacing.

Phase ordering.

Amplitude ratios.

Spectral sidebands.

The timing between extrema expressed as fractions of the dominant period rather than seconds.

The local Geneva trace had been noisy.

Quench transients contaminated the final milliseconds.

RF intervention altered the actuator spectrum.

The counter-field itself modified the system being measured.

It was not a pristine cosmic fingerprint.

It was the memory of a machine fighting for its life.

Ian isolated only the interval before the full counter-field reached matched amplitude.

Then he calculated the dominant local mode ratios.

The astronomical data had far fewer cycles.

Its dominant period remained only approximately constrained.

Still, one ratio persisted.

$$ \rho_f = \frac{f_{\mathrm{secondary}}}{f_{\mathrm{primary}}} $$

Sector Four:

rho_f = 1.9996 ± 0.0021

Astronomical residual:

rho_f = 2.004 ± 0.019

Ian stared at the values.

Approximately two.

A trivial ratio.

Harmonics did that.

It proved nothing.

He wrote:

Consistent with ordinary harmonic structure. LOW INFORMATION VALUE.

Then continued.

A second mode ratio:

Sector Four:

3.0018 ± 0.0047

Astronomical:

2.97 ± 0.05

Again close to three.

Again too ordinary.

Ian felt irritation.

The sky was behaving like a Fourier textbook.

Then he examined phase.

The Geneva trace contained a persistent phase offset between the primary and second harmonic that had survived actuator intervention.

Not exactly pi over two.

Not pi.

An awkward value.

$$ \Delta\phi_{21} \approx 1.37,\mathrm{rad} $$

Astronomical fit:

$$ \Delta\phi_{21} \approx 1.4 \pm 0.2,\mathrm{rad} $$

Ian leaned back.

Better.

Still weak.

He opened the null ensemble.

If he allowed arbitrary phase offset after the global scale was fixed, how often would unrelated quasi-periodic residuals reproduce the same harmonic hierarchy?

The answer was disappointing.

Often enough.

He saved the result.

STRUCTURAL MATCH: INTERESTING, NOT DISCRIMINATING.

He felt relief again.

And again disliked himself for it.

At 09:46, Elena Marovic called.

Not emailed.

Called.

Ian looked at the network terminal.

The call request blinked.

He almost ignored it.

Then accepted.

Her face appeared beneath fluorescent office lighting.

"You look terrible," she said.

"Good morning."

"Is it?"

"Locally."

"You found something."

Ian said nothing.

Marovic leaned closer to the camera.

"You only become polite when you are hiding something."

"I need another epoch."

"Of course you do."

"Preferably from the opposite side of Earth's solar orbit."

She stopped smiling.

"Parallax."

"Potentially."

"You think the anomaly has a localized three-dimensional source."

"I think the apparent displacement field may contain a parallax component."

"That's not the same sentence."

"No."

She considered him.

"Good."

Ian looked at the observation calendar.

"We have optical data separated by roughly six months."

"Not cleanly."

"I know."

"JWST is not sitting on Earth."

"I know."

"It's near Sun-Earth L2 in a large halo orbit."

"I know."

"So if I hear you say 'six-month baseline equals two AU' I'm hanging up."

Ian looked at her.

"I fitted the actual barycentric observatory ephemerides."

Marovic smiled.

"That is why I still answer your calls."

Ian shared the residual geometry.

Not the Geneva comparison.

Only the astronomical fit.

Three compact optical references.

One nearby radio astrometric reference.

Multiple epochs.

An apparent displacement field changing with observer position.

Marovic's expression became serious.

"How much?"

"Preliminary parallax-like amplitude just over one arcsecond."

She stared at him.

"That is enormous."

"For a nearby geometric feature."

"Or catastrophically wrong calibration."

"Yes."

"Did you solve source parallax individually?"

"No. Common-field displacement first. Then a shared geometric term."

"Good."

She pointed toward one vector.

"That one's carrying too much weight."

"I know."

"Drop it."

"I already did."

"And?"

"Uncertainty doubles. Central value moves less than one sigma."

Marovic sat back.

"Damn."

Ian did not react.

She looked at the timestamp.

"Send me the ephemeris fit."

"Not my interpretation."

"Obviously."

"Native centroids. Covariance. Observatory barycentric state vectors."

"I know how this works now."

"You keep trying to become sarcastic."

"I was sarcastic before we met."

The call ended five minutes later.

For the next eleven days, two independent reductions proceeded in parallel.

Ian at Coats.

Marovic in Leiden.

They did not exchange fitted parallax values.

Only agreed inputs.

Reference-frame definition.

Observatory ephemerides.

Source-selection rules.

Covariance propagation.

The anomaly was treated not as a point object but as a common angular distortion field projected across several background references.

The geometry was awkward.

A gravitational lens would normally be inferred from deflection patterns around a mass distribution.

This was not yet a lens.

The vectors lacked a simple static radial symmetry.

They evolved.

Still, the observer baseline modulated their common component in a way ordinary detector calibration should not.

Ian modeled the angular term as a phenomenological displacement vector whose apparent direction changed with the actual barycentric position of each observatory.

No fixed two-AU assumption.

No circular Earth orbit approximation.

The observatory state vector came from the real ephemeris.

$$ \boldsymbol{\theta}{\mathrm{obs}}(t) = \boldsymbol{\theta}0 + \Pi,\frac{\mathbf{R}{\mathrm{obs},\perp}(t)}{\mathrm{AU}} + \Delta\boldsymbol{\theta}{\mathrm{dyn}}(t) $$

Where:

Pi represented the fitted parallax-like amplitude.

R_obs,perp(t) was the component of the observatory's barycentric position perpendicular to the inferred line of sight.

delta_theta_dyn(t) represented the slowly evolving intrinsic anomaly.

The two components were partially degenerate.

That made the fit fragile.

Ian liked fragile fits only when they survived attack.

He attacked it.

Changed the dynamical basis.

Result moved.

Added another low-order temporal term.

Uncertainty widened.

Removed it.

Fit tightened.

Too much freedom made the distance meaningless.

Too little freedom forced the data.

He settled on the simplest model that passed residual diagnostics.

Not because it looked best.

Because additional parameters failed to improve predictive performance enough to justify themselves.

Then he waited for Marovic.

Her message arrived at 02:03.

I hate you.

Ian opened it.

Below:

Do not send your value. Mine is attached. Password in separate channel.

He downloaded the file.

Moved it through staging.

Opened it.

Marovic's result:

Parallax-like amplitude: 1.083 ± 0.011 arcsec

Ian closed the file.

He did not look at his own value yet.

He wrote hers on paper.

Then reopened his fit.

Coats result:

1.077 ± 0.008 arcsec

He combined them only after confirming the pipelines were sufficiently independent to justify the weighting.

They were not perfectly independent.

Same underlying public observations.

Different centroid extraction.

Different distortion treatment.

Different nuisance modeling.

Shared ephemerides.

Shared physics.

Ian therefore did not pretend the combination created a fully independent measurement.

He used a covariance inflation term for shared systematics.

Final working estimate:

Parallax-like amplitude: 1.080 ± 0.004 arcsec

$$ \Pi = 1.080 \pm 0.004\ \mathrm{arcsec} $$

Ian stared at the number.

Distance in parsecs followed from the standard parallax relation.

$$ d_{\mathrm{pc}} = \frac{1}{\Pi_{\mathrm{arcsec}}} $$

Using the fitted value:

$$ d \approx 0.926 \pm 0.003\ \mathrm{pc} $$

Converted to light-years:

$$ d \approx 3.020 \pm 0.010\ \mathrm{ly} $$

Ian did not move.

Three point zero two light-years.

The laboratory seemed suddenly too small.

He checked the calculation manually.

Once.

Again.

The number stayed.

He wrote:

IF INTERPRETED AS GEOMETRIC PARALLAX.

Then, larger:

MODEL-DEPENDENT DISTANCE. NOT YET A PHYSICAL OBJECT.

The warning was necessary.

The fit showed that the angular disturbance behaved as though associated with a localized geometric structure at that scale.

It did not prove there was an object three light-years away.

It did not prove a source.

It did not prove motion.

It did not prove Geneva.

Still, the number existed.

Three light-years.

Close enough to be local on galactic scales.

Far enough that nothing conventional from Geneva could have reached there since the experiment.

Unless the chronology was not what it seemed.

Ian looked at the Sector Four cartridge again.

For the first time, the question reversed itself.

What if Geneva had not sent the signal outward?

What if Geneva had responded to something already there?

Marovic called ten minutes later.

"You looked."

"Yes."

"Same?"

"Within uncertainty."

She swore softly.

Ian did not correct her.

"Tell me the combined value."

"One point zero eight zero arcseconds."

A pause.

"Uncertainty?"

"Four milliarcseconds after shared-systematic inflation."

"Distance."

"Point nine two six parsecs."

Another pause.

"Three point zero two light-years."

Marovic leaned back.

"That's obscene."

"It is a fit."

"Yes."

"Not an object."

"Yes."

"Not a lens."

"Yes."

"Not a wormhole."

Ian looked at her.

"I didn't say wormhole."

"I'm protecting myself from your personality."

Ian ignored that.

Marovic became serious.

"What does the residual look like across wavelength?"

"Within current uncertainty, achromatic."

"Optical only?"

"Optical and radio directionally compatible."

"Plasma?"

"Chromatic dispersion would be expected."

"Could still be calibration."

"Yes."

"Solar-system dynamics?"

"Ephemeris fit included."

"Unmodeled binary reference?"

"Extragalactic."

"Microlens?"

"Static microlensing doesn't fit the evolving vector field."

"Moving lens?"

"Possible, but the morphology is wrong under the simplest point-mass model."

"Extended mass?"

"Not excluded."

Marovic rubbed her eyes.

"Good."

Ian frowned.

"Good?"

"If you had said 'nothing else fits,' I was going to stop helping."

She looked at the number again.

"Three light-years."

"Model-dependent."

"I heard you."

Then:

"What happens in six months?"

Ian turned toward the observation calendar.

"That is the problem."

"Visibility?"

"Yes."

The field would not remain continuously observable.

JWST's Sun-avoidance geometry limited the window.

HST could provide additional epochs.

VLBI could continue independently.

The next useful observer-baseline configuration would occur only after the anomaly had evolved significantly.

Marovic understood immediately.

"So this isn't a six-month experiment."

"No."

"It's two windows separated by six months, with whatever intermediate clocks we can steal."

"Exactly."

She smiled.

"Now you sound like an astronomer."

Ian considered that an insult.

The next phase became an exercise in patience.

Month one after the second window:

No new JWST data.

One HST observation.

Weak.

Useful.

Month two:

Two VLBI epochs.

One contaminated by tropospheric calibration uncertainty.

Discarded before Ian saw the fitted direction.

The other survived.

Month three:

HST again.

The optical field continued drifting.

Not linearly.

Its apparent direction rotated slowly.

Month four:

No optical data.

Radio only.

Month five:

A scheduled observation failed because of an unrelated spacecraft safing event.

Ian stared at the notification for eleven minutes.

Then closed it.

No conspiracy.

No meaning.

A machine had entered safe mode.

That was all.

Month six:

The next high-value optical epoch arrived.

By then Ian had stopped sleeping normally.

The observatory walls carried six months of printouts.

Each was timestamped.

Each reduction had a version number.

Each rejected epoch remained archived with the reason for rejection.

No disappearing inconvenient data.

No moving center.

Sarah Hayes saw his name again in an internal astrometry note before she heard from him.

She was no longer at the NGC.

After the Geneva incident, she had remained through the engineering review, the Sector Four teardown, and the first phase of collider reconstruction.

Then she left.

Not because Sterling fired her.

He did not.

The review board formally reprimanded her for preserving Ian's sandbox without authorization, but it also concluded that the local autonomous control architecture had materially reduced the severity of the incident.

Her career survived.

Her trust in centralized systems did not.

Three years later, Sarah was leading distributed control architecture for a European orbital metrology consortium when a colleague forwarded a preprint draft.

No sensational title.

No claim of spacetime rupture.

Just:

Coherent, Slowly Evolving Astrometric Residuals Across Independent Optical and Radio Reference Frames

Sarah opened it.

Read the methodology first.

Of course.

Then the author list.

I. Yoo

E. Marovic

Sarah stared at the screen.

Ian had finally used another instrument.

She kept reading.

The paper did not mention Geneva.

That concerned her more than if it had.

At Coats, Ian added the latest epoch.

The six-month-scale modulation now possessed enough phase coverage to fit the phenomenological period more tightly.

$$ f = (1.20 \pm 0.03) \times 10^{-7},\mathrm{Hz} $$

Equivalent period:

$$ T \approx 96.5 \pm 2.4\ \mathrm{days} $$

The parallax-like term remained stable.

$$ \Pi = 1.080 \pm 0.004\ \mathrm{arcsec} $$

Distance under that model:

$$ d = 3.020 \pm 0.010\ \mathrm{ly} $$

The null ensemble had become harsher as the analysis matured.

Ian expanded the controls to include look-elsewhere effects from all sky fields and period searches attempted by the pipeline.

The false-alignment rate dropped as temporal prediction succeeded.

Not to zero.

Never zero.

The latest value was small enough to demand external attention.

Large enough that Ian refused to call it proof.

He stared at the whiteboard.

Six months earlier:

NOT DISCOVERY.

Now, underneath:

REPRODUCIBLE ANOMALY. PHYSICAL INTERPRETATION OPEN.

He left both statements visible.

Only then did he return to Geneva.

He loaded the Sector Four local phase telemetry.

No visual overlay.

No free alignment.

The global time-scale ratio had to be measured once.

The dominant astronomical frequency:

$$ f_{\mathrm{astro}} \approx 1.20 \times 10^{-7},\mathrm{Hz} $$

The corresponding characteristic Sector Four mode existed in the compressed local waveform at a vastly higher frequency.

Ian calculated the ratio.

Then locked it.

No further stretching.

The comparison algorithm allowed:

one global dilation factor,

one amplitude normalization,

one constant phase offset.

Nothing else.

No local time warping.

No nonlinear remapping.

No machine-learning alignment.

The transformed Geneva waveform appeared beside the astronomical residual.

The peaks did not coincide perfectly.

They should not.

Noise.

Actuator contamination.

Sparse astronomical sampling.

But the structure persisted.

Primary extrema.

Secondary shoulder.

Phase inversion.

Mode ratio.

Ian ran the null ensemble.

Randomized Geneva phases.

Control astronomical fields.

Alternative scaling ratios.

One hundred thousand trials.

Then one million.

The match survived.

Not as a p-value of causation.

As a statement about structural correspondence under pre-registered degrees of freedom.

Ian wrote:

Same dynamical fingerprint is plausible. Common origin not established.

He looked at the sentence.

Then added:

Direction of causation unknown.

He hated that one less than he used to.

At 18:22, someone knocked on the observatory door.

Ian looked toward the security monitor.

A woman stood outside in the rain wearing a dark waterproof coat and carrying one hard equipment case.

Sarah Hayes.

Ian did not move for several seconds.

Then went downstairs.

He opened the door.

Sarah looked past him into the dark hallway.

"You still haven't fixed the exterior lighting."

"It works."

"It is producing approximately twelve photons."

"Enough to identify visitors."

"Good to see exile improved your hospitality."

Ian looked at the case.

"What is that?"

"Independent timing hardware."

"You came from the Netherlands?"

"Geneva."

Ian's expression changed.

Sarah noticed.

"Not the NGC."

"Then why Geneva?"

"Because that's where the meeting was."

"What meeting?"

"The one where your preprint ruined my week."

Ian stepped aside.

Sarah entered.

Water ran from her coat onto the old stone floor.

She looked around the lobby.

"You really did turn this place into a bunker."

"Laboratory."

"I saw the airlock procedure for USB drives."

"Staging protocol."

"Bunker."

Ian closed the door.

"Why are you here?"

Sarah looked at him.

"Because your sky anomaly has a clock."

Ian said nothing.

She lifted the equipment case.

"And I have another one."

That stopped him.

"Independent?"

"Independent of your optical pipeline."

"Instrument?"

"Not one."

She began walking toward the stairs.

"An array."

Ian did not follow immediately.

Sarah looked back.

"Pulsars."

The word settled into the hallway.

Ian's expression changed.

"PTA?"

"Archival timing residuals."

"How many years?"

"Enough."

"Direction?"

Sarah held up a hand.

"No."

Ian stopped.

She almost smiled.

"Good. You learned."

She continued upstairs.

"I am not telling you the sky direction until you define the test."

Ian followed.

For six months, he had measured the anomaly in light.

Sarah had arrived carrying time.

The second clock had entered the observatory.

## Chapter 2: The Epistemological Wall

### [Scene 1: Bureaucratic Suppression]

Sarah Hayes did not open the equipment case.

Not immediately.

She placed it on the central workbench beneath the observatory's old brass transit instrument and looked around Ian's laboratory as though inspecting a system that had failed certification.

Six GPU racks.

Two FPGA cabinets.

Independent clock distribution.

Local storage.

Cryogenic test equipment.

Separate network staging.

Every cable labeled.

Every dependency visible.

No redundancy Ian had not personally chosen.

Sarah took off her wet coat.

"You've been busy."

Ian looked at the case.

"Define the test."

"Coffee first."

"The data won't improve."

"No. I will."

Sarah found the kettle without asking.

Ian watched her fill it.

"You remember where everything is."

"You have rearranged almost nothing."

"I rebuilt half the laboratory."

"You put faster machines where the slower machines used to be."

She switched on the kettle.

"Psychologically, this room is unchanged."

Ian ignored that.

"Pulsars."

Sarah leaned against the workbench.

"We are not touching the pulsars until you understand why I brought them here instead of sending you a file."

"Security?"

"No."

"Chain of custody?"

"Partly."

"Institutional restriction."

Sarah looked at him.

"Closer."

The kettle clicked.

She poured water into two mugs.

Ian took his without thanking her.

Sarah opened hers.

"You submitted the astrometry preprint three weeks ago."

"Yes."

"Two weeks ago, one of the timing groups I work with asked whether I knew you."

"Why?"

"Because they had seen a residual structure in several archival pulsars."

Ian's eyes sharpened.

Sarah raised one finger.

"No direction."

He stopped.

"They had already detected it?"

"They had detected something."

"Before my paper?"

"Before publication. After the preprint circulated internally."

"So they may have been contaminated."

"Exactly."

Ian looked at her more carefully.

Sarah continued.

"The timing consortium had an automated residual-search project running against historical releases. Not for spacetime anomalies. They were testing low-frequency common processes, clock errors, ephemeris mismodeling, gravitational-wave backgrounds, and pipeline stability."

"How many pulsars?"

"I'm not telling you yet."

Ian's jaw tightened.

"Good."

Sarah almost smiled.

"They found a weak directional component that did not fit the preferred isotropic noise model."

"When?"

"The first automated flag appeared eight months ago."

Ian stopped.

"Before I found A-173."

"Yes."

That mattered.

A lot.

"Why wasn't it published?"

"Because weak directional structures appear in PTA residuals all the time."

"Solar-system ephemeris errors."

"Possible."

"Clock error."

"Possible."

"Interstellar dispersion."

"Modeled."

"Red-noise mismatch."

"Possible."

"Backend transition?"

"Tested."

"Gravitational-wave source?"

"Also possible."

Ian looked toward the whiteboard.

"And then they saw the astrometry."

"One analyst did."

"Who?"

"Not important yet."

"It is if they changed the model after seeing my direction."

Sarah nodded.

"Which is why I did not bring their final directional fit."

Ian looked at the equipment case again.

"What did you bring?"

"Frozen inputs."

He waited.

Sarah continued.

"Publicly releasable pulse times of arrival. Noise-model files. Solar-system ephemerides. Clock corrections. Backend metadata. Timing-model parameters. Everything needed to reconstruct the residuals from the existing archive without using the consortium's anomaly solution."

"Format?"

"TEMPO2-compatible. I converted several release packages into a local HDF5 container for transport, but the source representation is preserved."

Ian nodded.

"HDF5 is packaging."

"Exactly."

"Not provenance."

"Exactly."

Sarah took a sip.

"You've become marginally less irritating."

Ian ignored that too.

She opened the equipment case.

Inside was not exotic instrumentation.

Three hardened solid-state drives.

One compact optical-clock transfer module.

A timing receiver.

A small FPGA board.

Ian looked disappointed.

Sarah noticed.

"What were you expecting?"

"A cesium fountain."

"On the train?"

"No."

"Good."

She removed the first drive.

"This is the frozen archive."

Second.

"Independent checksum mirror."

Third.

"My local reconstruction."

Ian reached for the third.

Sarah slapped his hand away.

"No."

He looked at her.

"You get the first."

"Then why bring the third?"

"To see whether you can reproduce what I saw without knowing what I saw."

Ian withdrew his hand.

Sarah placed the first drive beside the staging machine.

"Before we load anything, you define the test."

Ian turned toward the whiteboard.

The astrometric result remained there.

Pi = 1.080 ± 0.004 arcsec

$$ \Pi = 1.080 \pm 0.004\ \mathrm{arcsec} $$

d = 3.020 ± 0.010 ly

$$ d = 3.020 \pm 0.010\ \mathrm{ly} $$

f = (1.20 ± 0.03) x 10^-7 Hz

$$ f = (1.20 \pm 0.03) \times 10^{-7},\mathrm{Hz} $$

Sarah looked at them.

"Cover the sky direction."

Ian frowned.

"You already know it."

"I do."

"So covering it changes nothing for you."

"It changes what you can accuse me of later."

He considered that.

Then erased the line-of-sight notation from the adjacent board and closed the astrometry visualization window on his terminal.

Sarah continued.

"Now define the nulls."

Ian wrote.

NULL 1: independent pulsar red noise

NULL 2: terrestrial clock error

NULL 3: solar-system ephemeris error

NULL 4: dispersion-measure variations

NULL 5: backend/systematic transition

Then:

ALTERNATIVE: spatially correlated directional timing residual

Sarah nodded.

"Good."

Ian added:

No use of optical anomaly direction during PTA reduction.

Then:

No frequency prior from astrometry during initial PTA search.

Sarah pointed at it.

"Important."

Ian wrote:

Directional fit only after residual model frozen.

Sarah nodded again.

Then he stopped.

"What statistic?"

"Your choice."

Ian thought.

A gravitational-wave background search often relied on characteristic spatial correlation patterns between pulsars.

But this anomaly, if real, might not follow the standard Hellings-Downs form.

Using an MSV-specific pattern would contaminate the test with his theory.

He wrote:

Stage 1: model-independent common low-frequency residual search.

Then:

Stage 2: fit dipolar / quadrupolar / localized directional bases without MSV prior.

Sarah looked at him.

"Better."

"And only after that—"

"Compare to optical."

Ian finished:

Stage 3: compare independently inferred sky direction, phase evolution, and characteristic frequency against astrometric anomaly.

Sarah folded her arms.

"Now we can open the archive."

The transfer took twenty-eight minutes.

Sarah spent most of them examining the observatory.

She stopped beside the cryogenic test stand.

"What's this?"

"Nothing relevant."

"That answer means relevant."

Ian remained at the terminal.

"Phase-control test hardware."

"For Geneva?"

"For the mathematics."

"Those are not different things to you."

"They are."

Sarah looked at the coil assembly.

"How cold?"

"Four point five kelvin during operation."

"Niobium-tin?"

"Experimental segment."

"Current?"

"Insufficient."

"For what?"

Ian did not answer.

Sarah looked at him.

"You're already trying to build it."

"Build what?"

"The counter-field outside a collider."

Ian turned from the terminal.

"Geneva demonstrated a local control law."

"Geneva demonstrated that an emergency local control law stabilized one anomalous event."

"Yes."

"That is not the same statement."

"I know."

"Do you?"

Ian did not answer.

Sarah returned to the workbench.

"You have not changed as much as your notebook suggests."

"What notebook?"

"The one where you finally learned to write 'unknown.'"

Ian looked at her.

"How do you know about that?"

"You left a photograph of the whiteboard in the supplemental files."

He looked irritated.

Sarah smiled.

"Metadata discipline, Dr. Yoo."

The archive mounted.

Ian read the directory structure.

Timing files.

Parameter files.

Noise models.

Observatory metadata.

Clock corrections.

Ephemerides.

Backend transition tables.

Interstellar dispersion records.

Years of observations compressed into files small enough to fit in one hand.

Pulsars did not measure spacetime continuously.

They measured arrival times.

A rotating neutron star hundreds or thousands of light-years away emitted pulses with extraordinary regularity. After correcting for observatory motion, interstellar propagation, relativistic effects, and the pulsar's own spin evolution, the remaining difference between expected and observed arrival time became a residual.

$$ R_a(t) = t_{\mathrm{observed},a} - t_{\mathrm{model},a} $$

For one pulsar, a residual could mean almost anything.

For many pulsars distributed across the sky, correlated residuals could expose something larger.

A clock error would affect them one way.

An ephemeris error another.

A gravitational-wave field another.

A directional geometric disturbance might leave its own pattern.

Ian began with nothing more ambitious than reconstructing the published timing solutions.

If he could not reproduce the ordinary residuals, the anomaly did not matter.

Six hours later, he had rejected his own first pipeline.

Sarah sat on the floor beside Rack Three eating an energy bar.

"What broke?"

Ian did not look away.

"Ephemeris conversion."

"You used which one?"

"Wrong internal frame."

"Good."

He turned.

"Good?"

"You found it."

"I lost three hours."

"You lost three hours before claiming spacetime broke."

She took another bite.

"Efficient."

Ian corrected the transformation.

Re-ran.

The residuals converged toward the consortium's published validation plots.

One pulsar remained wrong.

He traced it to a backend transition.

Another carried a dispersion-measure reconstruction mismatch.

Fixed.

At 19:21, the baseline reconstruction passed.

Ian wrote:

PUBLIC TIMING SOLUTIONS REPRODUCED WITHIN RELEASE TOLERANCE.

Only then did he begin the blind residual search.

The first low-frequency common process was obvious.

Too obvious.

A monopolar component affected nearly every pulsar.

Ian stared at it.

Sarah did not.

"Clock."

"Probably."

"Prove it."

Ian separated the residuals by observatory.

The component tracked a known historical terrestrial time-standard correction.

Removed.

The second structure appeared dipolar.

Solar-system ephemeris.

He switched between independent ephemeris realizations.

The amplitude moved.

Strongly.

Not the anomaly.

The third appeared only below a specific observing frequency.

Dispersion.

Rejected.

The fourth existed mostly in one instrument generation.

Backend.

Rejected.

Hours passed.

The room became darker around them.

Sarah turned on no additional lights.

Ian eventually did.

At 23:46, a residual survived.

Weak.

Distributed.

Not present in every pulsar.

Not centered on one observatory.

Not strongly chromatic.

Not removed by reasonable ephemeris variation.

Ian said nothing.

Sarah watched him.

"Found something?"

"Maybe."

"Good answer."

He opened the spatial-correlation basis.

No MSV prior.

No optical direction.

The fit preferred a localized directional term over pure monopole or dipole models.

Not overwhelmingly.

Enough to continue.

Ian froze the noise model.

Saved the version.

Generated a cryptographic hash.

Printed the configuration.

Then he finally allowed the sky direction to solve.

The optimizer ran.

A broad uncertainty region appeared.

Ian looked at Sarah.

"Do you know the answer?"

"Yes."

"Don't react."

"I wasn't planning to."

The best-fit direction settled.

Perseus.

Not exactly his optical centroid.

Close.

Ian felt the room change.

He did not zoom.

He did not overlay the astrometry yet.

He wrote the numerical coordinates down.

Then the covariance region.

Only then did he reopen the optical fit.

The two sky regions appeared on separate screens.

They overlapped.

Not perfectly.

Enough.

Ian calculated the angular separation between best-fit directions.

Then propagated both covariance ellipses.

The result showed compatibility within the combined uncertainty.

Sarah said nothing.

Ian looked at her.

"How close was your solution?"

She opened the third drive.

Her reconstruction appeared.

Same broad region.

Different best-fit point.

Compatible.

Ian felt the first real chill of the day.

"This is independent."

"More independent than the astrometry pipelines."

"Same physical phenomenon?"

Sarah shook her head immediately.

"Don't."

Ian stopped.

She pointed at the screens.

"What do we know?"

He looked at the optical map.

Then the timing map.

"Two independent observational architectures identify low-frequency anomalies consistent with the same broad sky direction."

"Good."

"One measures apparent angular displacement."

"Yes."

"One measures pulse-arrival residuals."

"Yes."

"The timing anomaly predates my astrometric search."

"Yes."

"That reduces post-selection contamination."

"Yes."

Ian looked at her.

"And the characteristic frequency?"

"Not yet."

He nodded.

The PTA frequency search was harder.

The timing archive spanned years.

The anomaly did not appear as a simple clean sinusoid.

It emerged as a low-frequency component whose phase evolution changed slowly across the archival baseline.

Ian fit the residual without using the optical 96.5-day period.

The posterior was broad.

Several peaks.

Aliasing.

Noise leakage.

Irregular sampling.

Sarah leaned over his shoulder.

"Don't pick the peak you like."

"I know."

"That one."

"I know."

She pointed.

"You're looking at it."

"I'm looking at all of them."

"Your pupils disagree."

Ian minimized the spectrum.

He switched to a model comparison across the full frequency range.

Then performed injection-and-recovery tests against each pulsar's actual cadence and noise model.

Two peaks collapsed as sampling artifacts.

Another correlated with annual ephemeris structure.

One remained.

$$ f_{\mathrm{PTA}} \approx (1.1 \pm 0.2) \times 10^{-7},\mathrm{Hz} $$

Ian stared.

The uncertainty was much larger than the optical measurement.

But it included:

$$ f_{\mathrm{astro}} = (1.20 \pm 0.03) \times 10^{-7},\mathrm{Hz} $$

Sarah exhaled slowly.

"Now compare."

Ian overlaid the posterior distributions.

Compatible.

He did not smile.

He looked unsettled.

Sarah noticed.

"What's wrong?"

"Nothing."

"You're lying."

Ian looked at the two results.

"Optical displacement can still be calibration."

"Yes."

"PTA can still be timing-model structure."

"Yes."

"But for both to independently choose the same sky region and compatible low-frequency band—"

"Becomes harder."

Ian nodded.

Sarah finished:

"Not impossible."

"No."

She looked at him.

"Good."

The next morning they took the result to the institution.

Not physically.

Through a secure video conference with the European timing consortium's review committee.

Sarah had arranged it before arriving in Scotland.

Ian objected when he learned that.

"You scheduled a review before we had a result."

"I scheduled a review for either result."

"If there was nothing?"

"We would tell them there was nothing."

Ian disliked the efficiency because it was good.

At 09:00, four faces appeared on the conference screen.

Dr. Miriam Kovacs, consortium science director.

Professor Laurent Besson, pulsar-timing specialist.

Dr. Aisha Rahman, astrometric calibration lead invited because of Ian's preprint.

And Dr. Thomas Reeve, systems integrity officer.

No politicians.

No lawyers.

No Sterling.

That disappointed the part of Ian that preferred obvious antagonists.

Kovacs began.

"Dr. Hayes tells me you reproduced the public timing solutions independently."

"Yes."

"And performed the directional search blind to the astrometric location."

"Yes."

"Documentation?"

Sarah uploaded the frozen configuration.

Kovacs scanned it.

"Good."

Besson spoke.

"Your low-frequency component is weak."

"Yes."

"Bayes factor against the consortium's preferred red-noise model?"

Ian gave the value.

Besson did not look impressed.

"Interesting. Not extraordinary."

"I agree."

That answer surprised him.

Rahman leaned forward.

"Your astrometric parallax-like distance concerns me more."

"It should."

"One point zero eight arcseconds is enormous."

"Under the phenomenological model."

"The phrase 'under the model' is carrying a great deal of weight."

"Yes."

"JWST and HST do not share identical PSFs."

"We do not compare PSF morphology."

"Reference catalog?"

Ian answered.

"Color terms?"

Answered.

"Observer ephemerides?"

Answered.

"Look-elsewhere correction?"

Answered.

Reeve interrupted.

"Do your Coats pipelines depend on proprietary calibration code?"

"No."

"Can we reproduce them?"

"Yes."

"Then provide the container."

Ian hesitated.

Sarah looked at him.

He knew what she was thinking.

Isolation is not independence.

Ian answered:

"Yes."

Kovacs folded her hands.

"Now the problem."

She brought up the PTA sky map.

Then the astrometric map.

They overlapped.

"The correspondence is compelling enough to investigate."

Ian waited.

"Not compelling enough to interpret as spacetime physics."

"I didn't claim that."

"Your preprint discussion section comes close."

"It lists possibilities."

"It lists one possibility with considerably more enthusiasm than the others."

Sarah looked at Ian.

He said nothing.

Kovacs continued.

"We have not excluded a common reference-frame pathology."

Ian frowned.

"Across optical and pulsar timing?"

"Not one software bug. A shared ephemeris or barycentric modeling issue could contaminate both."

Ian considered it.

Possible.

Rahman added:

"Especially because both analyses transform observations into solar-system barycentric frames."

That was a real vulnerability.

Ian did not like it.

Therefore it mattered.

"What test?"

Rahman answered immediately.

"Re-run the astrometry under independent barycentric ephemeris realizations."

Besson added:

"And the PTA timing solutions."

"Already varied in the PTA."

"Not against a jointly designed cross-domain null."

Sarah wrote it down.

Kovacs continued.

"Second: clock independence."

Ian gestured toward the PTA.

"Pulsar timing uses independent observatories."

"Which still ultimately inherit terrestrial time standards in the reduction."

Sarah nodded.

"She's right."

Ian glanced at her.

Kovacs continued.

"Third: selection."

She looked at Ian.

"You searched thousands of fields before finding A-173."

"I corrected for that."

"Within your pipeline."

"Yes."

"We want an independently constructed null ensemble."

Ian felt irritation rise.

"At what point does independent become infinite regress?"

Kovacs did not react.

"When the evidence is strong enough that reasonable alternative systematics become less probable than the anomaly."

Ian stared at her.

Sterling could have said it.

That made the answer harder to dismiss.

Besson spoke next.

"There is another issue."

He displayed the pulsar set.

"Your localized directional basis has broad support because only a subset of pulsars contributes strongly."

"Geometry."

"Maybe."

"Noise?"

"Maybe."

"Then increase the array."

"We don't have enough high-quality pulsars in that direction."

Ian said:

"Use longer archival baseline."

"That increases low-frequency sensitivity but also red-noise modeling risk."

"Then both."

Besson smiled faintly.

"You have been away from institutions too long."

Ian did not smile back.

"Meaning?"

"Meaning telescope time and timing quality are not generated by algebra."

Sarah looked away to hide a reaction.

Kovacs intervened.

"We will authorize an internal cross-validation effort."

Ian leaned forward.

"Internal."

"Initially."

"Why not release the anomaly map?"

"Because the timing result is not yet robust enough."

"The raw data are public."

"Much of it is."

"The analysis can be reproduced."

"Yes."

"Then what are you withholding?"

"The interpretation."

Ian went still.

There it was again.

Different institution.

Same word.

Interpretation.

Kovacs saw the change.

"Dr. Yoo."

He said nothing.

"We are not deleting anything."

"I know."

"We are not restricting the public timing releases."

"I know."

"We are not preventing you from publishing your own analysis."

"Then what are you doing?"

"Refusing to attach the consortium's institutional endorsement to a claim we have not independently verified."

Ian stared at her.

That answer was defensible.

He hated that more.

Kovacs continued.

"The high-level internal anomaly product will remain restricted until the joint systematics review is complete. Raw observations remain where they are. Your analysis remains yours."

"How long?"

"Six weeks for the first review."

"Too long."

"For what?"

Ian almost answered.

For the wave.

For Geneva.

For whatever had crossed three light-years of inference and returned in two independent clocks.

But he had not shown them Geneva.

Not yet.

Sarah spoke before he could.

"Six weeks."

Ian looked at her.

She did not look back.

After the call ended, Ian closed the conference window harder than necessary.

Sarah remained seated.

"They are doing exactly what Sterling did."

"No."

"They found an anomaly and restricted the product."

"They preserved the raw data."

"So did Sterling."

"They authorized independent cross-validation."

"Sterling authorized review."

"They are not revoking your access."

"Because they can't."

Sarah turned toward him.

"This is not Geneva."

Ian stood.

"The vocabulary is identical."

"Because some of the vocabulary describes responsible science."

He looked at her.

"Restrict."

"Context matters."

"Internal."

"Context."

"Unverified interpretation."

"Context."

Ian turned away.

Sarah's voice hardened.

"You are pattern-matching institutions now."

He stopped.

"Don't."

She continued.

"You spent six months building a method to prevent yourself from pattern-matching the sky. Use it on people."

Ian looked back.

For several seconds neither spoke.

Sarah pointed toward the dark conference screen.

"Kovacs gave us three falsifiable failure modes."

"Reference-frame pathology."

"Yes."

"Clock inheritance."

"Yes."

"Selection bias."

"Yes."

"All testable."

"Exactly."

Ian looked toward the observatory wall.

He wanted the institution to be wrong.

That was a problem.

He recognized it.

Slowly.

He picked up a marker.

On the whiteboard beneath the PTA result, he wrote:

INSTITUTIONAL OBJECTION 1: SHARED BARYCENTRIC REFERENCE

Then:

2: TERRESTRIAL CLOCK INHERITANCE

Then:

3: INDEPENDENT NULL CONSTRUCTION

Sarah watched.

"Better."

Ian capped the marker.

"If they all fail?"

"Then the wall gets smaller."

"And if they don't?"

"Then we were wrong."

Ian looked at her.

She held his gaze.

"That is still allowed."

Six weeks later, the wall did get smaller.

Not disappear.

Independent astrometric analysts reconstructed the anomaly under two alternative barycentric ephemeris solutions.

The central displacement changed slightly.

The directional structure remained.

PTA analysts repeated the timing fit under independent ephemerides.

The localized component weakened under one realization.

Strengthened under another.

It survived both.

A separate group built the null ensemble from scratch without Ian's field-selection history.

The false-alignment rate increased.

Then dropped again when predictive epochs were included.

No single test converted the anomaly into certainty.

That was not how evidence accumulated.

Alternatives died one at a time.

The consortium released a technical note.

The language was cautious.

A low-significance, directionally localized timing residual has been identified in archival PTA data. The residual is statistically compatible with an independently reported astrometric anomaly. Shared solar-system reference-frame systematics investigated to date do not fully account for the correspondence. No physical interpretation is presently endorsed.

Ian read the final sentence three times.

No physical interpretation is presently endorsed.

Three years earlier, he would have read only the refusal.

Now he read the sentence before it.

do not fully account for

A negative result.

A useful one.

Sarah stood beside him.

"They didn't suppress it."

"They delayed it."

"To test it."

"Yes."

She looked at him.

"You sound disappointed."

"I'm updating the model."

"Of the anomaly?"

Ian looked at the note.

"Of institutions."

Sarah smiled.

"Careful. Small sample."

Ian almost smiled back.

Then the notification arrived.

A new file had appeared in the secure review channel.

Not from the timing consortium.

From Geneva.

NGC INCIDENT ARCHIVE — LIMITED CROSS-REFERENCE REQUEST APPROVED

Ian's expression changed.

Sarah saw it.

"What did you ask them for?"

"Nothing."

She stepped closer.

Ian opened the message.

The sender was Arthur Sterling.

One line.

If your sky has a clock, Dr. Yoo, compare it against the machine that first taught you to distrust one.

Attached was not the NGC raw archive.

Only a limited release.

Sector Four final central metrology summary.

Reference timing reconstruction.

Actuator-state chronology.

Enough to compare Ian's local cartridge against the institutional record.

Not enough to answer causation.

Sarah read the message.

"That doesn't look like suppression."

Ian said nothing.

For three years, Sterling had been easier to understand as a wall.

Walls were simple.

They divided.

This was harder.

Sterling had opened a door.

Only a narrow one.

But enough for another test.

### [Scene 2: Arrival and the Hidden Node]

The Geneva data arrived at 04:18.

Not through the observatory network.

There was no path from the network terminal downstairs into Ian's laboratory.

Sterling's office had sent the approved release through a bonded scientific courier: two encrypted solid-state drives, sealed inside a tamper-evident transport case, accompanied by a paper chain-of-custody record long enough to make Sarah smile.

Ian did not.

He turned the case over in his hands.

"Two drives."

"Mirror copies," Sarah said.

"I can count."

"Then why say it?"

"One would have been enough."

Sarah signed the courier receipt.

"One would have been enough if evidence never failed."

The courier left.

Ian looked at the seals.

Each carried the CERN asset-control number, transfer time, receiving authorization, and cryptographic manifest identifier.

Nothing clandestine.

Nothing hidden.

Sterling had made the release bureaucratically boring.

Ian found that irritating.

Sarah noticed.

"You wanted a secret envelope."

"No."

"Preferably hand-delivered by a repentant physicist in the rain."

"No."

"With a confession."

Ian put the case on the table.

"Open it."

The package contained less than Ian had hoped.

Exactly as promised.

No detector event stream.

No complete beam diagnostics.

No full optical metrology archive.

No raw high-rate timing from the entire NGC.

No unrestricted incident database.

Instead:

SECTOR FOUR CENTRAL METROLOGY SUMMARY

REFERENCE TIMING RECONSTRUCTION

FAST-ACTUATOR STATE HISTORY

MACHINE-PROTECTION EVENT CHRONOLOGY

SURVEY FRAME / LOCAL GEOMETRY TRANSFORM

INCIDENT REVIEW CALIBRATION NOTES

And one read-only file signed by Arthur Sterling.

Ian opened it.

There was no greeting.

Dr. Yoo,

This release contains only material the incident review concluded can be separated from restricted detector and personnel records without destroying provenance. It is not the complete NGC archive. Do not represent it as such.

The local cartridge in your possession contains the actuator's memory. This package contains part of the machine's reconstruction of the same interval. Neither contains the event in full.

A. Sterling

Sarah read over Ian's shoulder.

"Accurate."

"He always did enjoy boundaries."

"This one matters."

Ian closed the note.

"I know what I have."

"Do you?"

He looked at her.

Sarah tapped the screen.

"Your cartridge tells you what the local system thought it was doing."

"It contains phase metrology."

"Local phase metrology."

"Which remained coherent."

"Inside its own clock domain."

Ian said nothing.

Sarah continued.

"Sterling's package gives us a separately reconstructed central chronology, built after the fact from a damaged timing network."

"Central timestamps failed."

"Some failed."

"Packets arrived out of order."

"Yes."

"So local is better."

Sarah shook her head.

"Different."

"Better for the event."

"Maybe."

Ian's expression tightened.

Sarah smiled.

"You still hate that word."

"Less than before."

"Growth."

They did not analyze the package upstairs.

That surprised Sarah.

Ian disconnected the drive reader, took the unopened evidence case, and walked toward the rear corridor.

"Where are we going?"

"Down."

"I've been here two days."

"You've been in the laboratory."

"There's another laboratory?"

"No."

He opened a narrow service door Sarah had assumed led to electrical equipment.

Behind it, stone steps descended beneath the observatory.

Sarah stopped.

"I knew it."

Ian looked back.

"What?"

"Bunker."

"It is not a bunker."

"You're taking me underground through an unlabeled door."

"Archive room."

"That is exactly what a person with a bunker says."

The room beneath Coats had once stored photographic plates, instrument records, and municipal astronomy archives.

Most had been moved decades earlier.

Ian had kept the shelving.

Everything else had changed.

The walls were old stone, but a freestanding insulated enclosure occupied most of the space without touching them. The enclosure sat on vibration-isolated mounts. Shielded power entered through one conditioned feed. Air moved through a filtered, desiccated heat exchanger.

Outside Scottish air never passed directly across the electronics.

No network cable entered.

No wireless access point existed.

A small sign beside the inner door read:

NO EXTERNAL TIMING SOURCE DURING ANALYSIS

Sarah looked at it.

"You're serious."

"Yes."

"You isolate time too?"

"During cross-comparison."

She opened the inner door.

The room beyond was smaller than she expected.

Two desks.

Three monitors.

One modest GPU workstation.

Two FPGA timing boards.

A local oscillator rack.

Write-blocked storage interfaces.

A printer.

No windows.

No scientific memorabilia.

No photographs.

No whiteboards covered in equations.

Only a clock mounted above the far wall.

It was analog.

Sarah pointed.

"That better be decorative."

"It is."

"Good."

She looked around again.

"What do you call this?"

"Nothing."

"Ian."

He placed the CERN case on the first desk.

"Comparison room."

"That's terrible."

"It describes the function."

"Which is why it's terrible."

She walked to the oscillator rack.

"This your master?"

"Local rubidium reference for long-term stability. Oven-controlled crystal for short interval characterization. The timing FPGA measures both."

"And no GPS discipline."

"Not while we're inside."

"Why?"

"I don't want an external correction entering after the datasets are loaded."

Sarah nodded.

That, at least, she approved.

The room did not need to know the correct civil time.

It needed to preserve intervals.

She looked at him.

"You really built a hidden node."

Ian frowned.

"It isn't hidden."

"The observatory director knows this exists?"

"Yes."

"Facilities?"

"Yes."

"Insurer?"

"Unfortunately."

"Then technically not hidden."

"Correct."

Sarah put her equipment case on the second desk.

"I am still calling it the Hidden Node."

"No."

"Too late."

The ingestion protocol took forty-one minutes.

Sarah insisted on reading Sterling's manifest before touching either drive.

Cryptographic hashes.

File sizes.

Creation timestamps.

Calibration version identifiers.

Incident-review provenance.

Each file had been exported from the restricted archive into a separate evidence package.

No mutable database connection remained.

Ian's local Sector Four cartridge received the same treatment.

The old device was mounted read-only.

Sarah calculated its hashes independently.

Then compared them against the checksums she had recorded three years earlier during the incident review.

All matched.

Ian looked at her.

"You had the hash."

"I wrote the engineering copy."

"You never told me you kept it."

"I didn't keep the data."

"You kept its fingerprint."

"Yes."

"Why?"

Sarah looked at him as though the answer were obvious.

"Because you had the data."

Ian almost objected.

Then understood.

If the cartridge had changed during his exile, Sarah needed a way to know.

The result appeared:

LOCAL CARTRIDGE CONTENT IDENTICAL TO 3-YEAR-OLD ENGINEERING HASH RECORD

Ian stared at the line.

For reasons he did not immediately understand, it affected him more than the astronomical anomaly had.

Three years of suspicion.

Three years of exile.

Three years during which anyone could have said his copy was corrupted, altered, contaminated, or reconstructed after the fact.

Now there was an independent checksum from the day of the incident.

Sarah noticed his silence.

"Don't make it emotional."

"It isn't."

"It is."

Ian turned toward the central package.

"Load the clocks."

There were four of them.

Not clocks in the ordinary sense.

Clock domains.

The NGC central timing system had distributed the facility master epoch through stabilized fiber.

Sector Four maintained its own local oscillator for autonomous protection.

The fast-actuator FPGA sampled within that local domain.

The machine-protection hardware maintained another event counter designed to remain functional during central network failure.

Under normal operation, they were continuously related.

During the incident, the relationships had failed.

That failure had once made the chronology look impossible.

Central packets had arrived after events they claimed preceded.

Commands had been received after local protection had already acted.

Some telemetry timestamps were inconsistent with the order of physical state changes.

At the time, people called it corrupted timing.

Ian had called it geometry.

Neither description had been sufficient.

Sarah displayed the reconstruction.

Four horizontal tracks.

CENTRAL MASTER

SECTOR FOUR LOCAL

FAST ACTUATOR

PROTECTION COUNTER

For the first 380 milliseconds of the collision train, the mapping between them was ordinary.

Then the lines began to separate.

Not because the oscillators suddenly changed frequency by large amounts.

Because the effective propagation delay through the timing network changed.

Sarah zoomed in.

"Here."

Ian leaned closer.

Central distribution signal left its source.

Fiber path nominal.

Receiver acknowledgment late.

Next pulse.

Later.

Then one appeared earlier relative to the reconstructed machine state.

Ian said:

"The path isn't monotonic in central coordinate time."

Sarah shook her head.

"Careful."

He looked at her.

"We don't know that."

"The packets—"

"We know packet arrival order stopped mapping cleanly to the central reconstructed chronology."

"That is the same operational consequence."

"Not the same physical statement."

Ian nodded reluctantly.

Sarah continued.

"The fiber wasn't severed."

"No."

"Optical power remained inside tolerance."

"Yes."

"Transceiver temperatures?"

"Nominal."

"Bit error rate?"

"Increased briefly, but not enough to explain the timing shift."

"Good."

She pointed at the local clock track.

"And this?"

Sector Four's local oscillator remained smooth.

Not perfect.

No oscillator was.

But its drift stayed within the pre-incident characterization envelope.

The fast-actuator event order remained internally consistent.

Protection events remained monotonic.

Sarah said:

"Local time survived better than distributed time."

Ian folded his arms.

"Because the distortion affected propagation between clocks more than the clocks themselves."

"That is one model."

"Best one."

"Maybe."

Ian gave her a look.

Sarah ignored it.

Their first task was not to compare Geneva with the sky.

It was to compare Geneva with Geneva.

Ian wanted to move directly to mode decomposition.

Sarah refused.

"If the local and central archives cannot be reconciled under a physically defensible timing transform, we stop."

"We know the central system recovered."

"Recovery is not provenance."

"The review already reconstructed it."

"Then we reproduce the review."

Ian sat back.

"This will take hours."

"Good."

He knew better than to argue with that word.

They began from invariant physical events.

Not timestamps.

A quench-detection threshold crossing.

A fast-corrector current command.

A measured RF phase step.

The local dump trigger.

The first protection interlock.

The onset of magnet energy extraction.

Events that existed in more than one archive through different sensors.

Sarah called them anchors.

Ian preferred constraints.

They used both words.

For each event, they recorded:

local FPGA tick,

central recorded timestamp,

protection counter,

actuator current response,

sensor latency estimate,

measurement uncertainty.

The first ten aligned under the normal timing transform.

The next four did not.

By event seventeen, central time lagged the local state by tens of microseconds.

By event twenty-two, the discrepancy changed sign.

Ian leaned toward the screen.

"There."

Sarah did not react.

"The sign change."

"I see it."

"A simple clock drift can't do that."

"Correct."

"Oscillator jump?"

"Would appear locally."

"It doesn't."

"Correct."

"Network queue?"

"Possible."

Ian frowned.

"Not with fiber timing packets."

"Congestion can still alter software telemetry."

"Not the hardware timing channel."

Sarah nodded.

"Then separate them."

They removed software-transported timestamps entirely.

Only hardware-stamped events remained.

The sign reversal persisted.

Ian's expression changed.

Sarah's did not.

"Now it's interesting."

"Interesting?"

"Yes."

"It's impossible under fixed propagation delay."

"Then fixed propagation delay is wrong."

He looked at her.

Three years earlier, that sentence would have sounded like surrender.

Now it sounded like method.

They fitted a time-dependent mapping between the local Sector Four clock and the central reference.

Not an arbitrary warp.

Sarah would not allow it.

The transform was constrained by the known oscillator stabilities and physical signal paths.

$$ t_{\mathrm{central}} = a,t_{\mathrm{local}} + b + \tau(t) $$

Where:

a represented relative clock-rate calibration.

b the fixed epoch offset.

tau(t) the variable propagation component.

Sarah pointed at the last term.

"This is the dangerous one."

"Because it contains the anomaly."

"Because it can contain anything if we let it."

Ian nodded.

They constrained tau(t) using only measurements independent of the actuator response they planned to compare later.

Fiber round-trip metrology.

Reference-pulse arrivals.

Independent optical path monitors.

No counter-field waveform.

No local anomaly fit.

The result emerged slowly.

The variable delay grew.

Reached an extremum.

Reversed.

Then collapsed toward nominal after local stabilization.

Ian looked at the curve.

It resembled nothing directly.

That was useful.

Sarah compared it against the central incident reconstruction.

Agreement within uncertainty.

Then against the local cartridge.

Again agreement.

Two archives.

Two teams.

Three years apart.

One timing transform.

Sarah wrote on the printer paper:

CENTRAL AND LOCAL EVENT ORDER RECONCILABLE WITHOUT ALTERING EITHER RAW CLOCK STREAM.

Ian read it.

"Add 'under variable propagation model.'"

Sarah did.

Then:

MODEL CAUSE OPEN.

Ian looked at her.

"You enjoy that."

"Very much."

They stopped at 15:20.

Sarah forced Ian upstairs.

"You need food."

"The timing transform is stable."

"So is your blood glucose until it isn't."

"I ate."

"When?"

Ian did not answer.

Sarah opened the refrigerator.

It contained:

milk.

mustard.

two eggs.

an unlabeled sealed container.

three energy drinks.

She looked at him.

"This is not food storage."

"There are oats."

"Where?"

"Cupboard."

Sarah found them.

"Congratulations. You remain technically alive."

They ate porridge at the old public lecture table beneath faded astronomical posters.

Rain had returned outside.

Ian kept looking toward the basement door.

Sarah noticed.

"Geneva will still be there in twenty minutes."

"The data will."

"That is what I meant."

"No."

She put down her spoon.

"You think the event is still happening."

Ian looked at her.

"Not literally."

"I didn't say literally."

He looked away.

Sarah continued.

"You have spent three years treating Sector Four as unfinished."

"It is unfinished."

"The explanation is."

"Same thing."

"No."

Ian almost smiled despite himself.

"You sound like my mother."

Sarah's expression changed.

She knew enough not to ask.

Ian looked down at the porridge.

"For her, sequence mattered."

"It usually does."

"She reconstructed my father's cremation from separate clock systems."

Sarah remained silent.

"The records contradicted the physical process."

He had never told her this much.

Sarah waited.

Ian continued.

"She kept saying the contradiction proved the chronology was wrong. Not why."

"She was right."

"I know."

"And you hated it."

"Yes."

Sarah took another spoonful.

"That explains several things."

Ian looked up.

"Such as?"

"Your personality."

He almost laughed.

Almost.

Back in the Hidden Node, Sarah removed the sky maps from every visible screen.

Ian noticed.

"Why?"

"Next test."

"Geneva against astronomy."

"No."

"Then what?"

"Geneva geometry without astronomy."

He understood.

They would derive the machine's preferred geometric axis first.

Only afterward would they compare it to the sky.

No visual expectation.

No Perseus.

No line drawn from Switzerland to anything.

Sarah loaded the Sector Four survey transform.

The NGC local coordinate frame was engineering geometry.

Longitudinal along the beamline.

Horizontal transverse.

Vertical.

The incident metrology residual, however, was not aligned perfectly with any machine axis.

Independent optical path sensors around Sector Four had measured a tensor-like deformation pattern.

At the time, the review had represented it through principal components rather than a physical spacetime model.

Ian reconstructed that decomposition.

Three eigenvectors.

One dominant.

Two weaker.

Sarah checked the sensor geometry.

"Any of these channels mechanically coupled?"

"Some share support structures."

"Then remove them."

"That destroys coverage."

"Good."

Ian stared at her.

She shrugged.

"If the axis survives with worse coverage, it deserves to live."

They removed mechanically correlated channels.

The dominant direction broadened.

Did not disappear.

They removed one entire instrument family.

Still present.

Switched weighting.

Moved.

Not much.

Sarah froze the solution.

GENEVA DOMINANT METROLOGY AXIS — LOCAL FRAME

Only then did she allow Ian to transform it into terrestrial coordinates.

Latitude.

Longitude.

NGC survey orientation.

Earth rotation at the event epoch.

Polar-motion correction.

The axis became a direction in the Earth-centered celestial frame.

But an axis had two directions.

Positive and negative were physically ambiguous at this stage.

Two antipodal sky regions.

Sarah printed both.

"Now optical."

Ian reopened the A-173 astrometric solution.

Its broad anomaly direction occupied a region projected toward Perseus.

He transformed both into the same celestial frame.

Then stopped.

Sarah noticed.

"What?"

"One of the Geneva axes crosses the optical region."

"How close?"

He calculated.

Not exact.

Within the combined angular uncertainty once the Geneva metrology-axis reconstruction was propagated.

The opposite pole pointed nowhere relevant in the current data.

Ian looked at Sarah.

She showed no reaction.

"Say it."

He did.

"The dominant Geneva metrology axis is directionally compatible with the astrometric anomaly region."

"Good."

"Under an independent reconstruction."

"Yes."

"Without using the astrometric direction."

"Yes."

Ian stared at the overlap.

Sarah pointed at the screen.

"What does it prove?"

"That the geometries align."

"Too strong."

"That their inferred directions are statistically compatible."

"Better."

"It is unlikely—"

"Stop."

Ian looked at her.

"Null first."

The null took the rest of the day.

How often would an arbitrary axis from Geneva overlap an astrometric anomaly region of that angular size?

Too often if the sky region were large.

Less often once the uncertainties were respected.

But that was not the only look-elsewhere problem.

Ian had tried multiple decompositions of the Geneva data over three years.

Different sensor subsets.

Different bases.

Different regularizations.

Even if none had been chosen specifically to match Perseus, model multiplicity mattered.

Sarah made him include them.

The alignment weakened.

Not vanished.

Ian hated the corrected number.

That was why he trusted it more.

They wrote:

DIRECTIONAL COMPATIBILITY: PERSISTENT UNDER MODEL-MULTIPLICITY CORRECTION. NOT UNIQUE EVIDENCE OF COMMON ORIGIN.

Sarah sat back.

"Now it's useful."

Ian looked at the screen.

"We have the same direction."

"We have compatible directions."

"Same characteristic structure."

"Maybe."

"Same frequency hierarchy."

"Partly."

"Optical and PTA both—"

"Different scene."

Ian stared at her.

Sarah smiled.

"You're stacking arguments faster than we've validated them."

He looked back at the screens.

Geneva local metrology.

Central reconstruction.

Astrometry.

Three independent processing histories.

A common geometric possibility.

Still no causation.

Ian said:

"What would convince you?"

Sarah thought.

"Convince me of what?"

"That Geneva and the astronomical anomaly are the same phenomenon."

"Bad question."

"Why?"

"Same phenomenon is vague."

Ian waited.

Sarah continued.

"I want a fingerprint that survives changes in scale."

"Mode ratios."

"Maybe."

"Holonomy."

"If you can define it operationally from both datasets."

"Winding."

"Again, if measured rather than assumed."

Ian looked at the Geneva phase data.

Sarah pointed at him.

"And I don't want you inventing a topological invariant because your theory has one."

He said nothing.

"I know that face."

"What face?"

"The one where mathematics is about to become evidence by enthusiasm."

Ian turned back to the terminal.

"Then we extract only observables."

"Good."

The next morning, they began decomposition.

Not MSV.

Not yet.

Geneva first.

From the local phase-metrology network they reconstructed phase differences around closed sensor loops.

The absolute phase was irrelevant.

Loop closure was not.

For a closed path of sensors, Ian calculated the accumulated phase increment.

$$ \Delta\Phi_{\mathrm{loop}} = \sum_k \Delta\phi_k $$

Before the incident:

approximately zero within calibration.

During the residual growth:

nonzero closure emerged.

During counter-field stabilization:

the leading component collapsed.

A smaller finite closure remained.

Ian stared at it.

This was familiar.

He had spent years calling it winding.

Sarah stopped him.

"What does the instrument measure?"

"Closed-loop phase accumulation."

"Then call it that."

"It is winding."

"Maybe in the model."

Ian sighed.

She was right.

He wrote:

OBSERVED: non-zero closed-loop phase accumulation.

INTERPRETATION: candidate winding / holonomy-like structure.

Sarah nodded.

"Now astronomy."

That was harder.

The optical residual field did not provide a literal ring of local phase sensors.

But multiple background-source displacement vectors sampled the apparent mapping of neighboring sky directions.

Over the observed patch, they could reconstruct a local transport field.

Sparse.

Noisy.

Incomplete.

Ian wanted to integrate it around a closed angular contour.

Sarah refused at first.

"Too few points."

"Interpolate."

"With what prior?"

"Minimum curvature."

"That imposes structure."

"Gaussian process."

"Also imposes structure."

"We need a field."

"We have samples."

Ian stopped.

Sarah continued.

"Do not promote samples into a continuous field until the data justify the interpolation."

He looked at her.

"Then no loop observable."

"Not yet."

Ian hated the answer.

He left the column blank.

That mattered.

At 13:11, the Hidden Node's local oscillator alarm sounded.

Not loud.

One tone.

Sarah looked up.

Ian froze the analysis.

Reference divergence had exceeded their pre-set tolerance.

Not because of the datasets.

The room's rubidium oscillator had drifted against the secondary crystal ensemble more than expected.

Ian checked temperature.

Normal.

Power.

Normal.

Sarah opened the rack.

One distribution amplifier had warmed by seven degrees.

"Fan."

Ian listened.

The cooling fan was still running.

"Airflow?"

Sarah held a strip of paper near the intake.

Weak.

Filter restriction.

Dust had accumulated where the desiccated internal air loop passed through the replaceable cartridge.

Ian reached for it.

Sarah stopped him.

"State first."

He understood.

They photographed the rack.

Recorded temperatures.

Logged oscillator comparison.

Only then replaced the filter.

Within twenty minutes, temperatures fell.

Frequency relation returned toward baseline.

Ian looked at Sarah.

"Hardware failure."

"Small one."

"Could have contaminated the analysis."

"Only if we let it."

All processing during the out-of-tolerance interval was marked invalid and rerun.

Ian did not complain.

The incident pleased Sarah more than it should have.

"What?"

Ian asked.

She pointed at the discarded results.

"That is why I came."

"To clean filters?"

"To make the machine capable of telling us no."

Ian looked at the rack.

Then at Geneva.

The phrase stayed with him.

On the third day, Sterling called.

Sarah answered.

Ian did not know the call was scheduled.

Arthur Sterling appeared on the upstairs conference terminal, older than Ian remembered.

Not dramatically.

Enough.

More gray at the temples.

Deeper lines beneath the eyes.

The same controlled posture.

Sterling looked first at Sarah.

"Dr. Hayes."

"Director."

Then at Ian.

"Dr. Yoo."

Ian said nothing.

Sterling continued.

"I assume the package arrived intact."

"It did."

"Provenance?"

Sarah answered.

"Verified."

"Central-local chronology?"

"Reproducible under a constrained variable-propagation model."

Sterling's expression did not change.

"That was the incident review's conclusion."

Ian spoke.

"You never called it variable propagation."

"We called it timing-distribution failure of unknown origin."

"Which is not the same."

"No."

Sterling looked at him.

"But it was the statement the data supported."

Ian felt the old anger.

Smaller now.

Still there.

Sarah intervened.

"We independently reconstructed a dominant metrology axis."

Sterling looked toward her.

"Using which sensor subset?"

She told him.

"Mechanical correlations removed?"

"Yes."

"Optical path monitors?"

"Retained where independently mounted."

"Result?"

Sarah looked at Ian.

He answered.

"Directionally compatible with the astrometric anomaly."

Sterling became still.

Not shocked.

Attentive.

"Blind?"

"Geneva axis frozen before the sky direction was opened."

"Null?"

"Model multiplicity included."

"Significance?"

Ian gave him the corrected result.

Sterling considered it.

"Interesting."

Ian almost laughed.

Sarah heard the impulse.

Sterling continued.

"Not sufficient."

"I know."

That answer produced the smallest visible reaction from Sterling.

Ian noticed.

Sterling said:

"You sound different."

"I have more data."

"No."

Ian looked at him.

Sterling did not elaborate.

Instead he asked:

"What physical claim are you prepared to make?"

Ian glanced toward the basement door.

Then back.

"The Geneva incident and the astronomical anomaly admit compatible reduced geometric descriptions across direction and limited mode structure."

Sterling waited.

Ian continued.

"I cannot establish a common origin from that."

Silence.

Sarah looked between them.

Sterling finally said:

"Good."

Ian hated how much the word mattered.

Then Sterling added:

"And causation?"

"Unknown."

"Could the astronomical disturbance have preceded Geneva?"

"Yes."

"Could Geneva have seeded it?"

"Yes."

"Could both be responses to a third process?"

"Yes."

"Can you currently discriminate?"

"No."

Sterling nodded.

"Then do not let the distance tempt you into a story."

Ian's expression tightened.

"Three point zero two light-years."

"I read the preprint."

"If the parallax-like interpretation is physical."

"Exactly."

"Then the light-travel chronology—"

"Is not the causal chronology unless you know what propagated and at what speed."

Ian stopped.

Sterling continued.

"You are measuring arrival structure. Do not confuse that with origin."

Sarah looked at Ian.

Another line he did not like.

Therefore another line worth preserving.

After the call, they returned downstairs.

Ian wrote on the Hidden Node printer paper:

ARRIVAL TIME ≠ ORIGIN TIME

Sarah looked at it.

"Keep that."

He added:

DIRECTION ≠ CAUSATION

Then:

STRUCTURAL MATCH ≠ COMMON SOURCE

Sarah nodded.

"Three useful sentences."

Ian stared at them.

"They are all negative."

"They are boundaries."

"Same thing."

"No."

He looked at her.

Sarah smiled.

"Your mother again?"

Ian did not answer.

That evening they finally allowed the four data structures onto one screen.

Geneva local phase.

Geneva central reconstruction.

Astrometric displacement.

PTA residual direction.

No artistic overlay.

No stretched traces made to coincide.

Four panels.

Four independent uncertainty structures.

Sarah stood with her arms folded.

Ian sat.

The temptation was immense.

The eye wanted unity.

The brain wanted one cause.

The plots seemed to lean toward one another.

Sarah said:

"Turn off the display."

Ian looked at her.

"Why?"

"Because you're seeing the picture now."

"We need the picture."

"No. We need the numbers."

He hesitated.

Then blanked the plots.

Only tables remained.

Sarah nodded.

"Better."

Ian began listing observables.

GENEVA LOCAL

variable propagation residual

coherent local phase closure

dominant metrology axis

actuator response under counter-field

GENEVA CENTRAL

independently reconstructed event order

reference timing deviation

fast-actuator chronology

protection recovery

ASTROMETRY

coherent centroid displacement field

achromatic within current limits

parallax-like term

approximately 96.5-day periodic component

broad Perseus-direction solution

PTA

localized low-frequency residual

broad compatible sky region

frequency posterior compatible with optical

multi-year archival presence

They stared at the list.

Ian said:

"Four systems."

Sarah corrected him.

"Three observational architectures. Geneva local and central are not independent physical observations."

"Independent processing histories."

"Yes."

"PTA predates the optical search."

"Yes."

"Geneva predates both analyses."

"Yes."

Ian looked at the sequence.

"If the same reduced structure appears in all three—"

Sarah raised a hand.

"Then we get to ask a better question."

"Which is?"

She pointed at the list.

"Whether there is a transformation that preserves the structure without being tuned separately to each dataset."

Ian's attention sharpened.

"One transform."

"Constrained."

"Global scale."

"Maybe."

"Dimensionless invariants."

"Preferably."

"No local warping."

"Absolutely not."

Ian stood.

For the first time in days, he smiled.

Not broadly.

Enough.

Sarah saw it.

"There he is."

"What?"

"The physicist who is happiest when the problem becomes harder."

Ian ignored her.

He erased a section of the whiteboard upstairs.

Then stopped.

No.

They were in the Hidden Node.

He took a fresh sheet of printer paper instead.

At the top he wrote:

CROSS-DOMAIN DECOMPOSITION

Beneath it:

Find what survives scale.

Sarah read it.

"That sounds almost poetic."

"It's a specification."

"Of course."

They worked until after midnight.

No result yet.

That was important.

Geneva had sub-second dynamics.

The sky had month-scale dynamics.

PTA sampling was irregular and stretched across years.

Amplitude meant different things in each domain.

Absolute phase had no obvious shared definition.

Frequency alone was not distinctive enough.

Harmonic ratios were too common.

Direction helped.

Closed-loop structure might help if astronomy eventually provided enough spatial sampling.

Eigenmode ratios might help.

A spectrum of geometric transport around the field might help.

Nothing yet deserved the word fingerprint.

At 01:37, Sarah closed her terminal.

Ian continued typing.

"Stop."

"No."

"We have frozen the transform class."

"I can run the first solve."

"Tomorrow."

"It will run overnight."

"Fine. Start it and leave."

Ian submitted the job.

The screen displayed:

ESTIMATED COMPLETION: 06:12

Sarah stood.

Ian remained seated.

She looked at him.

"What?"

"Leave the room."

"I designed the room."

"And now it needs isolation from you."

Ian frowned.

Sarah pointed toward the running job.

"No watching partial results."

"I can monitor convergence."

"You can also decide unconsciously that one branch looks promising and change tomorrow's analysis."

"I won't."

"You already know you will."

Ian looked at the progress bar.

Two percent.

He stood.

Powered off the displays.

The computation continued without them.

They left.

Sarah closed the inner door.

Then the outer.

The Hidden Node disappeared behind old stone and an unlabeled service entrance.

Nothing about the observatory above changed.

Rain struck the dome.

Paisley slept.

The sky remained where it had been.

Below them, three years of machine memory and six months of astronomical anomaly were being reduced without an audience.

Ian stood in the corridor.

"What if it matches?"

Sarah put on her coat.

"Then we try to break it."

"And if it survives?"

"Then we find someone who doesn't want it to."

Ian looked at her.

Sarah continued.

"Not an enemy. A skeptic."

"Sterling."

"Eventually."

"He already knows."

"He knows the question."

She started toward the stairs.

"He does not know the answer."

Ian followed.

At the top of the steps, he stopped and looked back at the closed door.

For most of his life, he had believed truth was what remained when every variable was known.

The Hidden Node was teaching him something less satisfying.

Sometimes progress meant refusing to look at the answer until the test had stopped moving.

Below them, the computation continued.

No observer watched.

No interpretation adjusted it.

For six hours, at least, the center would stay fixed.

## Chapter 3: Two Clocks

### [Scene 1: Verification and Decimation]

The first cross-domain solve did not converge.

At 06:14, the Hidden Node produced seventeen pages of diagnostics, two unstable eigenmodes, and a final line Ian disliked on principle.

SOLUTION NOT IDENTIFIABLE UNDER CURRENT PARAMETERIZATION

Sarah read it over his shoulder.

"Good."

Ian looked at her.

"No."

"Yes."

"The transform is underconstrained."

"Which means the machine refused to invent one."

Ian scrolled upward.

Geneva's sub-second waveform could be stretched across the astronomical time base under too many combinations of scale, phase, and mode assignment. The PTA data made the problem worse. Its sampling was irregular, its low-frequency structure broad, and its noise model carried enough freedom to absorb several candidate correspondences.

Ian had wanted one transformation.

The solver had found a family.

That was not a fingerprint.

It was permission to overfit.

He closed the result.

Sarah put down her coffee.

"What survives if we throw away the pictures?"

Ian did not answer immediately.

She continued.

"Not the plots. Not the interpolated fields. Not anything that requires your eye."

"Centroids."

"Good."

"Arrival-time residuals."

"Good."

"Geneva hardware event times."

"Good."

"Covariance."

"Always."

Ian looked at the screens.

"We lose morphology."

"We lose the morphology we are currently inventing between samples."

He turned toward her.

"Interpolation is not invention."

"It can be."

"Then constrain it."

"No."

Sarah pulled a chair beside him.

"You're still trying to preserve too much."

Ian folded his arms.

"Meaning?"

"Every dataset has a rich internal structure. Different instrument, different cadence, different coordinate system, different noise. You're asking one global model to respect all of it at once."

"That is the point."

"No. The point is to find what is common."

She tapped the astrometry panel.

"If the common structure is real, it should survive reduction."

"Reduction can destroy information."

"Yes."

"Then—"

"And if the result disappears the moment we stop feeding it instrument-specific detail, maybe the detail was carrying the result."

Ian looked back at the screen.

He did not like the logic.

That usually meant Sarah was right.

They began with the astrometry.

Sarah refused Ian's original phrase.

decimated field

"No."

"It is technically correct."

"It sounds like you're destroying a signal."

"We are reducing sampling density."

"Then say reduction."

Ian sighed.

Sarah opened a new pipeline specification.

At the top she wrote:

INSTRUMENT-INDEPENDENT SUFFICIENT STATISTICS

Ian looked at it.

"That's optimistic."

"It's a target."

They defined the output for each usable optical observation:

source identifier,

observatory,

barycentric timestamp,

centroid displacement vector,

full covariance matrix,

wavelength band,

calibration family,

observer barycentric state vector.

Nothing else.

No rendered image.

No PSF residual map.

No interpolated distortion surface.

No anomaly morphology.

The native images remained archived.

The comparison pipeline would not see them.

Sarah said:

"I don't want it learning the telescope."

"It isn't machine learning."

"I don't want you learning the telescope through the comparison."

Ian nodded.

They generated the reduced astrometry table.

The apparent richness of six months of observations collapsed into rows of numbers.

Ian stared at it.

"It looks weaker."

"Good."

"Again."

"If the result needs a pretty plot, I don't trust it."

The HST data required special treatment.

Its older epochs were not contemporaneous with the anomaly.

They existed primarily to stabilize the long-baseline source positions and test whether the later displacement could be absorbed into conventional astrometric motion.

Sarah separated them.

BASELINE EPOCHS

ANOMALY EPOCHS

Ian objected.

"That labeling presumes anomaly."

She changed it.

HISTORICAL EPOCHS

RECENT EPOCHS

"Better?"

"Yes."

"You're exhausting."

"I know."

The historical HST measurements anchored the pre-event reference frame.

JWST supplied the strongest later optical measurements.

Intermediate HST epochs helped track evolution when geometry allowed.

VLBI remained separate.

Radio would not be merged into the optical solution merely to increase significance.

Ian said:

"Same sky."

Sarah replied:

"Different instrument family."

"Which is why it helps."

"Which is why we compare after independent fitting."

He nodded.

That distinction had become automatic now.

Almost.

VLBI resisted reduction more than the optical data.

The geodetic radio sources carried atmospheric delay uncertainties, station-clock terms, and source-structure effects that had no optical counterpart.

Ian wanted to propagate the full calibration model into the shared fit.

Sarah refused.

"Fit it in radio space."

"Then we lose cross-domain covariance."

"We never had honest cross-domain covariance."

Ian looked at her.

She continued.

"Different systematics. Don't pretend one giant covariance matrix makes them comparable."

The VLBI group had already supplied independently reduced positions with uncertainty ellipses.

They kept those.

Nothing more.

The optical and radio data would meet only at the level of measured sky-direction residuals.

No shared instrument nuisance parameters.

No forced image registration.

No common PSF assumptions.

Only geometry.

At 09:18, Sarah wrote the first blind-comparison rule.

No dataset may be rotated into the coordinate frame of another after anomaly extraction.

Ian added:

All vectors transformed only through declared celestial-frame transformations.

Sarah nodded.

Second rule:

No amplitude normalization before directional comparison.

Ian looked at her.

"We need amplitude eventually."

"Eventually."

Third:

No temporal interpolation across unobserved intervals for significance calculation.

Ian frowned.

"Then sparse sampling kills us."

"It tells us what we actually measured."

He added:

Interpolation may be used for visualization only, never as independent evidence.

"Good."

Fourth:

Model choices frozen before cross-dataset overlap is revealed.

Ian looked toward the basement door.

"We already know some overlap."

"Then we start from this point and stop making it worse."

The first reduced optical test failed one of Ian's preferred interpretations.

He had expected the displacement amplitude to scale smoothly across the field.

It did not.

One reference source moved less than the phenomenological model predicted.

Another moved more.

The directions remained coherent within uncertainty.

The amplitudes did not.

Ian stared at the table.

"Source structure."

Sarah shook her head.

"Maybe."

"Microlensing contamination?"

"Maybe."

"Covariance underestimated."

"Maybe."

He looked at her.

"Do you have another word?"

"Yes."

"What?"

"Failure."

Ian leaned back.

"The amplitude field fails."

"Under the current model."

He highlighted the result.

DIRECTIONAL COHERENCE SURVIVES. SIMPLE AMPLITUDE MORPHOLOGY DOES NOT.

Sarah nodded.

"That is more useful than forcing the amplitude."

Ian saved it.

The anomaly became narrower conceptually.

Less beautiful.

More defensible.

They moved to time.

The astronomical residual had been described by a characteristic period near ninety-six and a half days.

But the value came from a phenomenological fit across sparse epochs.

Sarah wanted to know how much the period depended on interpolation.

They removed the smooth curve.

Kept only observed epochs.

Fit a family of low-frequency models directly to the discrete data.

The posterior broadened.

$$ f_{\mathrm{astro}} = (1.20 \pm 0.03) \times 10^{-7},\mathrm{Hz} $$

became:

$$ f_{\mathrm{astro,discrete}} \approx (1.19 \pm 0.06) \times 10^{-7},\mathrm{Hz} $$

Ian frowned.

"Twice the uncertainty."

"More honest."

The corresponding period widened.

$$ T \approx 97 \pm 5\ \mathrm{days} $$

Still consistent.

Less precise.

Sarah wrote:

Use 96.5-day value for phenomenological description only. Cross-domain test uses discrete-data posterior.

Ian agreed.

Reluctantly.

The PTA archive underwent the same treatment.

No sky map.

No smoothed residual field.

No dramatic pulsar plot.

For each pulsar:

timestamped residual,

uncertainty,

observing band,

noise-model state,

observatory identifier,

timing-model version.

Then a second-stage reduction:

low-frequency residual coefficients,

covariance,

independently fitted directional contribution.

Sarah looked at the result.

"Ugly."

"Good?"

"No. Actually ugly."

Ian almost smiled.

The PTA direction was broad.

Several pulsars dominated the fit.

One had large red-noise uncertainty.

Another carried partial annual covariance.

When those were down-weighted according to their full noise model, the apparent localization weakened.

It did not disappear.

But the sky region expanded.

Ian calculated the overlap with the astrometric direction.

Still compatible.

Less impressively.

He saved that too.

PTA LOCALIZATION BROADENS UNDER CONSERVATIVE NOISE MODEL. OPTICAL REGION REMAINS INSIDE HIGH-PROBABILITY SUPPORT.

Sarah nodded.

"Now we have something that might survive a hostile reader."

The hostile reader arrived at 13:04.

Not Sterling.

Dr. Miriam Kovacs.

The consortium science director joined by video from Budapest and opened with:

"I reviewed your reduced tables."

No greeting.

Sarah approved.

Ian did not care.

Kovacs continued.

"Your astrometry is cleaner than your timing."

"Yes."

"Your timing localization is less stable than your preprint implies."

"The preprint did not include this reduction."

"Good."

She looked at Sarah.

"You did this?"

"We did."

Kovacs returned to Ian.

"Then why are you still calling it a direction?"

"Because the posterior is localized relative to the full sky."

"Broadly."

"Yes."

"Not enough to identify a source."

"I did not say source."

Kovacs nodded once.

"Good."

She shared a plot.

A control simulation.

The same PTA pipeline run against synthetic red-noise realizations with the actual sampling cadence.

Several produced localized patches.

One overlapped the optical region by chance.

Ian looked at the rate.

"How many?"

"Ten thousand realizations."

"Overlap fraction?"

Kovacs showed it.

Higher than he wanted.

Sarah leaned forward.

"Conditioned on frequency compatibility?"

"Not yet."

Ian said:

"Then the control is incomplete."

Kovacs replied:

"Correct."

He stopped.

He had expected resistance.

She had given him agreement.

Kovacs continued.

"We are building the joint null now. My point is that directional overlap alone is weak."

"We know."

"Good. Then stop using phrases like 'two clocks pointing to the same place.'"

Sarah looked at Ian.

He had used exactly that phrase in a draft heading.

He deleted it.

After the call, Sarah wrote on the whiteboard:

DIRECTION = SUPPORTING EVIDENCE

Then:

TIME STRUCTURE = POTENTIALLY STRONGER

Ian nodded.

The same weak sky region could arise by chance.

A compatible low-frequency structure made the coincidence less likely.

But only if the frequency comparison was genuinely independent.

The problem was subtle.

The PTA search had been conducted without the optical frequency prior.

Good.

But the frequency posterior was broad.

The optical value sat inside it.

That was not equivalent to an exact match.

Ian wrote:

PTA frequency does not "measure 96.5 days."

Sarah looked at him.

"Keep that."

He added:

It supports a low-frequency component compatible with the optical band.

"Better."

He stared at the wording.

Less dramatic.

More true.

The next question was phase.

If two observables responded to the same underlying disturbance, their phases might be related.

But absolute phase across astrometry and pulsar timing was not obvious.

The instruments measured different physical quantities.

One angular displacement.

One pulse-arrival residual.

A common process could produce a derivative or integral relationship rather than direct phase equality.

Ian began writing candidate transforms.

Sarah stopped him.

"What predicts the phase relation?"

"The MSV perturbation equations."

"Then we are no longer model-independent."

"At some point we have to test the model."

"Yes. Not before we finish verifying the phenomenon."

Ian put down the marker.

Sarah continued.

"First question: are there two anomalies?"

"Yes."

"Careful."

He corrected.

"Two observational datasets contain residual structures not fully explained by tested systematics."

"Good."

"Second question: are they statistically related?"

"Now you're ready."

"Third: does MSV explain the relation?"

"Later."

Ian hated the delay.

He accepted it.

They built a pre-MSV correlation test.

No theoretical phase relation.

Only empirical lag.

The optical residual time series was too sparse for conventional cross-correlation.

So they used the discrete observation times and the PTA posterior predictive model.

For each allowed lag, they asked whether the optical epochs occurred at consistent phases of the independently inferred PTA low-frequency component.

No free local stretching.

One global lag.

That was all.

The first result showed a preferred lag.

Broad.

Not zero.

Ian stared.

Sarah said:

"Does zero fall inside?"

"At two sigma, yes."

"Then don't call it phase offset."

"Preferred lag."

"Fine."

He wrote:

EMPIRICAL LAG WEAKLY CONSTRAINED. NO UNIQUE PHASE RELATION YET.

Another piece of beauty removed.

Another piece of evidence strengthened by surviving without it.

At 17:32, Marovic joined them remotely.

She had reviewed the reduced astrometry.

Her first sentence:

"You've thrown away half the information."

Sarah answered:

"Yes."

Marovic looked at Ian.

"And you allowed this?"

"No."

Sarah looked at him.

Ian corrected.

"Eventually."

Marovic opened the centroid table.

"The good news is I can reproduce this without your images."

"That's the point," Sarah said.

"The bad news is the third source still irritates me."

Ian nodded.

"Amplitude."

"Yes."

"We've downgraded amplitude morphology."

"Good."

Marovic highlighted the directions.

"But the directional residual remains."

"Across both optical pipelines."

"Yes."

She switched to the historical HST baseline.

"And the recent deviation still cannot be absorbed into ordinary proper motion."

"Correct."

"Parallax-like term?"

"Stable within the conservative model family."

Marovic read the value.

"One point zero eight zero arcseconds."

"Model-dependent."

"I know."

Sarah asked:

"What is the strongest statement you would sign your name under?"

Marovic thought.

Then:

"Multiple compact background references, observed across independent optical reduction pipelines and supported by radio astrometry, exhibit a slowly evolving coherent angular displacement that is not explained by tested calibration, proper-motion, or simple chromatic systematics."

Sarah nodded.

Ian wrote it down.

Marovic continued:

"I would not yet sign 'geometric disturbance.'"

Ian said:

"I would."

"I know."

"Achromatic."

"Within current sensitivity."

"Radio compatible."

"Directionally."

"Parallax-like."

"Model-dependent."

Ian looked at Sarah.

"Are you both doing this intentionally?"

"Yes," they said together.

For the first time all day, Ian laughed.

Briefly.

The next morning, they began the blind reduction again from scratch.

Different operator order.

Sarah handled optical.

Ian handled PTA.

Neither saw the other's intermediate results.

Marovic provided a frozen astrometric packet without the final direction label.

Kovacs supplied a frozen PTA packet without the sky map.

The Hidden Node became exactly what Sarah had named it.

A node between instruments.

No one inside it had complete information.

Ian hated the arrangement.

Therefore he trusted it.

Sarah reduced the optical observations to centroid displacement vectors and covariance.

Ian reduced the PTA archive to a low-frequency directional posterior.

They saved.

Hashed.

Printed.

Only then did they exchange outputs.

Sarah entered the optical best-fit direction.

Ian entered the PTA posterior.

The computer transformed both into the common celestial frame.

No manual rotation.

No scale adjustment.

No visual overlay until the numerical test completed.

The screen remained blank.

Ian watched the status line.

CALCULATING SPHERICAL OVERLAP...

Sarah stood behind him.

Neither spoke.

Result:

OPTICAL DIRECTION INSIDE PTA 68% SUPPORT REGION: NO

Ian's stomach tightened.

Then:

INSIDE PTA 95% SUPPORT REGION: YES

He stared.

Weaker than the earlier solution.

Sarah exhaled.

"Good."

Ian looked at her.

"That is not good."

"It survived blind reduction."

"At ninety-five percent."

"Which is broad."

"Too broad."

"For discovery, yes."

He leaned back.

Sarah continued:

"But it did not fail."

Ian stared at the value.

He wanted a tighter overlap.

The data did not owe him one.

He saved the result.

The frequency comparison came next.

Optical discrete-data posterior:

$$ f_{\mathrm{opt}} \approx (1.19 \pm 0.06) \times 10^{-7},\mathrm{Hz} $$

PTA:

$$ f_{\mathrm{PTA}} \approx (1.1 \pm 0.2) \times 10^{-7},\mathrm{Hz} $$

Overlap substantial.

Still broad.

The joint null ensemble now included:

random optical field selection.

randomized pulsar phases.

alternative red-noise realizations.

ephemeris variations.

the full set of searched low-frequency bands.

No hand-picked controls.

No Geneva.

One hundred thousand trials.

The computation ran for three hours.

Sarah went upstairs.

Ian stayed.

She came back ten minutes later.

"Leave."

"I am not changing anything."

"You're watching."

"That has no effect."

"On the computer, no."

He looked at her.

"On you."

Ian stood.

They left the Hidden Node.

When they returned, the result was waiting.

JOINT NULL REALIZATIONS: 100,000

REALIZATIONS WITH >= OBSERVED DIRECTIONAL + FREQUENCY COMPATIBILITY: 63

Ian calculated silently.

$$ p_{\mathrm{joint}} \approx 6.3 \times 10^{-4} $$

Sarah looked at him.

"Interesting."

Ian almost objected.

Then stopped.

"Yes."

Not discovery.

Not proof.

But no longer easy to dismiss as two unrelated noise structures.

They expanded to one million null realizations overnight.

The rate remained of the same order.

Ian wrote:

CROSS-DOMAIN CORRESPONDENCE SURVIVES INDEPENDENT REDUCTION AND JOINT NULL TEST.

Then below:

PHYSICAL CAUSE UNDETERMINED.

Sarah read it.

"Now I would show Sterling."

Ian looked toward the Sector Four cartridge.

"Not yet."

Sarah followed his gaze.

"You want Geneva."

"Yes."

"We said phenomenon first."

"We have phenomenon."

"We have two residual structures with statistically nontrivial correspondence."

"Exactly."

"That sentence is deliberately less exciting than yours."

Ian stood.

"It's enough."

"For what?"

"To open the third clock."

Sarah looked at him.

"Your cartridge?"

"No."

He pointed toward Sterling's limited release.

"The machine."

Before they touched Geneva again, Ian returned to the optical data one last time.

He opened the images.

Sarah saw.

"What are you doing?"

"Checking something."

"We agreed—"

"Not for significance."

She stopped.

Ian displayed the field.

Tiny background sources.

Almost nothing visible.

Then the residual vectors.

He turned them off.

Without arrows, the sky looked normal.

That mattered.

No torn stars.

No visible distortion.

No cinematic scar.

Only photons arriving a fraction away from where the model expected.

He said:

"If we had never measured the centroids, nobody would know."

Sarah stood beside him.

"That is often how instruments work."

"Three light-years away."

"Model-dependent."

Ian nodded.

He no longer needed her to say it.

He zoomed back out.

The sources became points again.

Sarah said:

"Don't fall in love with the picture."

"I'm not."

"Good."

Ian closed it.

From that moment forward, the images were presentation.

The evidence was numbers.

Centroids.

Timestamps.

Covariance.

Arrival-time residuals.

Independent clocks.

The sky had been reduced until almost nothing remained.

What survived was harder to dismiss.

And now Geneva would have to survive the same treatment.

### [Scene 2: The Second Clock]

The pulsars did not know Geneva existed.

That was why Sarah trusted them.

At 08:16 the next morning, she wrote the sentence on a sheet of printer paper and taped it above the timing workstation.

Ian read it.

"That's not technically meaningful."

"It's operationally useful."

"Pulsars don't know anything."

"Exactly. Which makes them excellent witnesses."

Ian looked at the timing archive.

Years of pulse arrival times.

Multiple observatories.

Different receivers.

Different frequency bands.

Different terrestrial clocks.

Different calibration histories.

Nothing in the archive had been built to test Ian Yoo's theory.

Most of the relevant observations had been taken before he had identified the optical anomaly.

Some before the Geneva incident had even acquired a public name.

Sarah pointed at the screen.

"The astrometry tells us that something in one region of the sky appears to be moving differently from our model."

"Yes."

"The PTA tells us something else."

"A timing residual."

"Say it properly."

Ian looked at her.

"Pulse arrival times deviate from their fitted timing models in a spatially correlated way."

"Better."

"And the preferred spatial support overlaps the optical anomaly."

"Broadly."

"Yes."

Sarah sat.

"Now prove that the second clock is actually a second clock."

The problem was that pulsar timing was full of clocks.

The observatory clock.

The terrestrial time standard.

The solar-system barycentric correction.

The pulsar's rotational model.

Binary orbital models where relevant.

Propagation through the interstellar medium.

Receiver delays.

Backend delays.

Every pulse arrived only after passing through a hierarchy of corrections.

A bad clock on Earth could create a common residual.

A bad solar-system ephemeris could create a dipolar pattern across the sky.

A gravitational-wave background could create a quadrupolar correlation.

Interstellar plasma could produce frequency-dependent delays.

A pulsar could simply misbehave.

Ian wrote the possibilities on the wall.

MONOPOLE — TERRESTRIAL CLOCK

DIPOLE — SOLAR-SYSTEM EPHEMERIS

QUADRUPOLAR / CORRELATED — GRAVITATIONAL-WAVE FIELD

CHROMATIC — DISPERSION / PROPAGATION

LOCAL — PULSAR / RECEIVER / BACKEND

Then Sarah added:

OTHER

Ian looked at it.

"Useful."

"It is the largest category in science."

They began with the terrestrial clocks.

The timing archive contained observations referred to several historical realizations of terrestrial time. Some had later correction tables. Some observatories had undergone hardware changes. A few older epochs depended on local masers before final transfer to a common standard.

Ian reconstructed the timing residuals under two independent terrestrial-time realizations.

The broad monopolar structure moved.

The localized directional component did not disappear.

He switched clock corrections.

Again.

The common offset changed.

The sky-dependent term remained.

Sarah said:

"If this were one bad terrestrial clock?"

"All pulsars should inherit a largely common-mode residual."

"Do they?"

"No."

"Can we exclude clock contamination completely?"

"No."

"Why?"

"Because terrestrial time enters multiple stages of the reduction."

"Good."

Ian wrote:

TERRESTRIAL CLOCK ERROR DOES NOT EXPLAIN OBSERVED SKY DEPENDENCE UNDER TESTED REALIZATIONS.

Not:

Clock error excluded.

Sarah approved.

Then the solar-system ephemerides.

This was harder.

Every observatory measurement had to be transformed from Earth to the solar-system barycenter. A small error in planetary masses or Earth's barycentric position could project into pulsar timing as a directional pattern.

That mattered because the astrometry used barycentric positions too.

A shared ephemeris pathology could make two independent instruments agree for the wrong reason.

Ian disliked the possibility.

Therefore they spent two days on it.

They repeated the timing solutions using independent planetary ephemerides.

They varied the outer-planet mass uncertainties within allowed ranges.

They inserted perturbations into Earth's barycentric position.

They deliberately degraded several corrections to see what a false signal looked like.

The result was instructive.

A barycentric position error produced a clean dipolar structure.

Pulsars on opposite sides of the sky moved in opposite timing directions.

The observed residual was messier.

Localized.

Phase-dependent.

Poorly fit by a pure dipole.

One alternative ephemeris weakened the signal substantially.

Ian stared at the result.

Sarah watched him.

"How much?"

"Thirty-one percent in amplitude."

"Significance?"

"Falls."

"Below useful?"

"No."

He reran it.

Same.

Sarah said:

"Write it."

Ian did.

SIGNAL SENSITIVE TO EPHEMERIS CHOICE.

He paused.

Then:

NOT REMOVED BY TESTED EPHEMERIDES.

Sarah nodded.

"Both."

Ian looked at the two lines.

He preferred the second.

The first was more important.

At 21:30, Elena Marovic joined by video.

Ian showed her the ephemeris sensitivity.

She looked pleased.

"You found a way to make your result uglier."

"Yes."

"Excellent."

Sarah smiled.

Ian did not.

Marovic continued.

"The optical solution?"

"Changes too."

"Same direction?"

"Within covariance."

"Parallax-like amplitude?"

"Shifts by less than the quoted shared-systematic envelope."

"And if you perturb Earth's barycentric position enough to force the PTA anomaly away?"

Ian brought up the test.

"The astrometric residual gets worse."

"How much?"

"Enough that the required perturbation is inconsistent with independent solar-system ranging."

Marovic leaned closer.

"That's useful."

Sarah said:

"Careful."

"I said useful."

Not proof.

Useful.

Ian was becoming surrounded by people who had learned his language faster than he had learned theirs.

The next test was chromaticity.

Interstellar plasma delayed lower-frequency radio waves more than higher-frequency ones.

$$ \Delta t_{\mathrm{DM}} \propto \frac{\mathrm{DM}}{\nu^2} $$

If the anomaly disappeared after modeling dispersion measure variations, the second clock would collapse back into interstellar weather.

They separated observations by radio frequency.

Low band.

Mid band.

High band.

The ordinary dispersion structures changed dramatically.

The candidate low-frequency timing component did not scale as one over frequency squared.

Its amplitude moved slightly with data quality.

Its sign and long-timescale phase did not.

Ian wrote:

NO DETECTED 1/nu^2 SCALING IN CANDIDATE COMPONENT.

Then, after Sarah looked at him:

WITHIN CURRENT SENSITIVITY.

She nodded.

The pulsars themselves were next.

One by one.

Ian hated this part.

A common process felt elegant.

Individual pulsars did not.

They glitched.

They changed spin-down behavior.

Their profiles evolved.

Some had binaries.

Some had decades of excellent timing and then years of inferior instrumentation.

Some contributed so little to the directional solution that removing them changed nothing.

Others carried uncomfortable leverage.

They performed leave-one-out tests.

Remove the strongest pulsar.

Signal weakens.

Remains.

Remove the second.

Broadens.

Remains.

Remove both.

Localization becomes poor.

Low-frequency common component survives.

Sarah said:

"That tells you?"

"The direction depends heavily on a few high-quality lines of sight."

"Which means?"

"We don't have a precision sky map."

"Good."

Ian added:

LOCALIZATION LIMITED BY ARRAY GEOMETRY.

The second clock had become less precise.

More real.

At 11:17 on the third day, Sarah changed the question.

"Stop asking where it is."

Ian looked at her.

"We need the direction."

"We have a broad one."

"Then what?"

"Ask whether the pulsars agree on when."

Ian's attention shifted.

Timing was what the array actually did best.

Not imaging.

The candidate process had been fitted as a low-frequency spatial component, but each pulsar carried an independently sampled projection of that process.

If those projections were unrelated red noise, their apparent phases should wander according to individual pulsar models.

If one external disturbance contributed to all of them, their timing residuals might become mutually consistent after accounting for line-of-sight geometry.

Ian started writing.

Sarah stopped him.

"No MSV response function."

He looked at her.

"We need a geometric projection."

"Generic first."

"What generic geometry?"

"Fit the data."

"That becomes unconstrained."

"Then constrain only what the array itself can measure."

They built a phenomenological directional timing field.

No rupture.

No Geneva.

No topology.

A slowly varying sky-dependent perturbation represented in a low-order basis.

Each pulsar saw one projection.

The fit did not force identical amplitudes.

It asked whether one shared temporal component could explain more of the residual variance than independent pulsar red-noise terms alone.

The result was weak at first.

Then Ian noticed the earliest years.

"The component fades backward."

Sarah looked.

"Data quality?"

"Possibly."

The oldest observations had larger uncertainties and fewer pulsars.

They restricted the analysis to the interval where array sensitivity was stable.

The shared temporal component sharpened.

Not sinusoidal.

Not clean.

But coherent.

Ian froze the model before comparing it to the optical epochs.

Then they opened the astrometric timestamps.

Sarah read them aloud.

Ian marked them on the timing solution.

The strongest optical displacement epochs occurred during a particular phase of the shared PTA component.

The historical HST baseline lay where the timing component was weaker.

Not zero.

Weaker.

Ian's heart rate increased.

"Phase locked."

Sarah shook her head.

"Compatible phase evolution."

"It is repeating."

"Approximately."

"Same low-frequency band."

"Yes."

"Same sky region."

"Broadly."

Ian exhaled.

Sarah continued.

"Now say only what survives all those adjectives."

He looked at the screen.

"A shared low-frequency temporal component inferred from multiple pulsars evolves consistently with the independently measured optical anomaly over the overlapping observing interval."

Sarah nodded.

"That I would sign."

The timing component extended earlier than the optical dataset.

That was what made it valuable.

Ian's astrometric discovery covered months.

The PTA archive extended years.

The relevant sensitivity was poorer further back, but the data existed.

They performed a retrospective search.

Not for the exact ninety-six-day period.

That would have been contaminated.

They applied the frozen timing model to older observations and asked how far back the shared component remained supported.

Two years.

Weakly.

Two and a half.

Marginal.

Three.

The evidence dissolved into noise.

Ian sat back.

"Onset?"

Sarah shook her head.

"Sensitivity horizon."

"We can't distinguish them."

"Correct."

The oldest usable evidence did not tell them when the anomaly began.

Only when the PTA could no longer see it.

Ian wrote:

EARLIEST DETECTABLE TIMING SUPPORT ≠ PHYSICAL ONSET.

Another boundary.

He left it.

At 14:44, Kovacs joined them again.

This time three pulsar specialists were with her.

No one used the phrase second clock.

That was Sarah's name.

Kovacs displayed the independent consortium reconstruction.

"We repeated your leave-one-out tests."

Ian waited.

"The localized solution broadens substantially without the two highest-weight pulsars."

"We saw that."

"The low-frequency common process remains preferred."

"Yes."

"We also repeated under three red-noise prescriptions."

"Result?"

"Amplitude changes. Temporal phase is more stable."

Ian leaned forward.

"How stable?"

Kovacs shared the posterior.

The phase uncertainty was still broad.

But not random.

Sarah said:

"Independent?"

"Your frozen model class. Separate implementation."

Ian asked:

"Optical timestamps hidden?"

"Until after freeze."

"And?"

Kovacs opened the overlay.

The astrometric epochs fell where Ian's pipeline had predicted.

Not exactly.

Within the timing uncertainty.

Kovacs said:

"I am prepared to call the cross-domain temporal correspondence nontrivial."

Ian waited for the rest.

"But not yet evidence of a specific gravitational or spacetime mechanism."

"Of course."

Kovacs looked at him.

"You sound annoyed."

"I'm anticipating you."

"Don't. It wastes time."

Sarah hid a smile.

Kovacs continued.

"We need an additional physically distinct observable."

Ian looked at Sarah.

She did not react.

Kovacs said:

"Optical astrometry and pulsar timing are independent instruments, but both still depend on reference-frame modeling. If you intend to argue spacetime geometry, you need something that does not enter through celestial position or pulse arrival time."

Ian knew exactly what that meant.

Geneva.

Sarah knew too.

Neither said it.

After the call, Ian returned to the Hidden Node.

He loaded no new data.

He simply stood before the wall of reduced results.

OPTICAL

angular displacement.

achromatic within current sensitivity.

parallax-like geometric term.

low-frequency temporal evolution.

PTA

arrival-time residual.

nonchromatic candidate component.

not monopolar.

not adequately pure-dipolar.

broad directional localization.

temporal evolution compatible with optical.

Two clocks.

Except the first was not really a clock.

Sarah entered behind him.

"You keep calling astrometry a clock."

"It samples evolution in time."

"So does a thermometer."

Ian looked at her.

"You're objecting to the metaphor now?"

"I'm refining it."

She pointed at the optical column.

"This is a ruler that changes with time."

Then PTA.

"This is actually closer to a clock."

Ian looked at her.

"So what do you want to call the chapter?"

Sarah frowned.

"What?"

"Nothing."

He turned back to the wall.

The difference mattered.

Astrometry said:

Where the light appears.

Pulsar timing said:

When the pulse arrives.

Different observables.

Different instruments.

Same sky.

Similar slow evolution.

The overlap was becoming difficult to dismiss.

Not impossible.

Difficult.

Ian said:

"If the optical anomaly were just an imaging calibration problem, the pulsars should not care."

"Correct."

"If the pulsar anomaly were just a receiver problem, the optical centroids should not care."

"Correct."

"If both were caused by a barycentric ephemeris error—"

"Then a specific shared reference pathology might make them agree."

"But the perturbations required to fit both violate independent solar-system constraints."

"Under the models we've tested."

Ian nodded.

"So the shared-reference explanation is shrinking."

"Yes."

"Not dead."

"No."

He stared at the wall.

That was enough.

They began the final timing-only test that evening.

Sarah called it the adversarial reconstruction.

Ian called it unnecessary.

They did it anyway.

Every pulsar was assigned to one of two groups.

Not randomly by observation quality.

Randomly by pulsar identity.

Half the sky in one fit.

Half in the other.

Each subset had worse directional coverage.

Each had larger noise.

The question was simple.

Could two disjoint sets of neutron stars infer compatible temporal structure without sharing the same individual pulsars?

First split.

One subset failed.

Second split.

Both survived, weakly.

Third.

One broad, one useful.

They repeated.

Hundreds of partitions.

Most were underpowered.

Enough were informative.

Across the informative splits, the preferred low-frequency phase did not scatter uniformly.

Ian calculated the distribution.

Sarah watched.

"Now?"

He answered carefully.

"The shared temporal component is not being generated by one pulsar or one small fixed subset."

"Better."

"Still dependent on array geometry."

"Yes."

"Still model dependent."

"Yes."

"But real enough to demand another explanation."

Sarah considered that.

"Yes."

Ian looked at her.

It was the first unqualified yes she had given him in days.

At 23:08, Ian opened the Sector Four directory.

Sarah saw the screen.

"We aren't comparing yet."

"I know."

He opened only the file list.

ACTUATOR COMMAND STREAM

LOCAL PHASE METROLOGY

PROTECTION TELEMETRY

FINAL LOCAL RING BUFFER

No waveform.

No plot.

Only names.

Sarah stood beside him.

"What are you thinking?"

"The astronomical anomaly has distance-like geometry."

"Model-dependent."

"The PTA has timing structure."

"Yes."

"Geneva has local phase and propagation structure."

"Yes."

"Three measurement architectures."

"Yes."

"If the same reduced dynamics survives all three—"

Sarah waited.

Ian did not finish the sentence.

Instead he closed the directory.

"Tomorrow."

Sarah looked almost surprised.

"Voluntarily?"

"The test isn't defined."

She nodded.

"Good."

Ian walked to the printer.

On a clean sheet, he wrote:

SECOND CLOCK — WORKING CONCLUSION

Then:

A spatially correlated, low-frequency timing residual is present in multi-year pulsar timing archives.

Its temporal evolution and broad directional support are statistically compatible with the independently reduced astrometric anomaly.

Tested terrestrial-clock, chromatic, receiver, and solar-system-ephemeris systematics alter the result but do not fully reproduce it.

This does not constitute a second distance measurement.

It is an independent timing observable.

Sarah read the page.

"Keep the last two lines."

Ian looked at her.

"They're the least interesting."

"They're the reason the rest is credible."

He taped the page beside the optical result.

Two independent columns.

Neither complete.

Neither sufficient.

Together, they narrowed the space in which coincidence could hide.

Then Ian added one final line beneath both.

NEXT TEST: DOES GENEVA CONTAIN THE SAME STRUCTURE WITHOUT BEING FORCED TO?

Sarah looked at the sentence.

"That one is dangerous."

"Why?"

"Because if the answer is yes, we're going to want causation."

Ian looked toward the sealed machine memory.

"We don't get causation."

"Not yet."

He nodded.

Not yet.

Three years earlier, that phrase would have felt like failure.

Now it sounded like a protocol.

The sky had given them one ruler and one clock.

Geneva held the third record.

And unlike the first two, it remembered the moment when the machine itself had changed.

### [Scene 3: The Third Clock and Decomposition]

The third clock had been running for less than half a second.

That was enough.

At 07:03, Ian placed the Sector Four cartridge on the Hidden Node workbench.

Sarah did not let him mount it.

"Definition first."

"We already defined the next test."

"We defined the question."

She pointed at the cartridge.

"Now define what this is."

Ian looked at her.

"Local machine memory."

"Too broad."

He waited.

Sarah continued.

"It is not the NGC archive."

"No."

"It is not the detector record."

"No."

"It is not the central timing system."

"No."

"It does not contain everything that happened in Sector Four."

"No."

"What does it contain?"

Ian answered more carefully.

"Local FPGA actuator commands, local phase metrology, final machine-protection telemetry, and the ring buffer surrounding the stabilization sequence."

"Referenced to?"

"The Sector Four local oscillator."

"Which survived the incident within its characterized stability."

"Yes."

"Verified against?"

"The checksum you recorded during the engineering review and Sterling's limited central reconstruction."

Sarah nodded.

"Good."

She took a sheet of paper.

At the top she wrote:

THIRD CLOCK

Then beneath it:

A local hardware record of how Sector Four evolved during the Geneva anomaly.

She turned the paper toward Ian.

"Not the truth."

Ian looked at the sentence.

"No."

"Not the cause."

"No."

"One surviving clock domain."

"Yes."

Sarah taped it beside the optical and PTA conclusions.

Three columns now occupied the wall.

The first measured where light appeared.

The second measured when pulses arrived.

The third measured when a machine acted.

Ian looked at them.

"Now?"

Sarah nodded.

"Now we define what the machine is allowed to tell us."

The local ring buffer contained four hundred and eighty-six milliseconds of high-rate data around the failure.

Most of it was useless for cross-domain comparison.

Ordinary beam control.

Diagnostic chatter.

Protection polling.

The final section was worse.

Once Ian's counter-field began to act, the machine was no longer merely measuring the anomaly.

It was interacting with it.

That made the most dramatic part of the waveform scientifically dangerous.

Ian highlighted the stabilization interval.

Sarah shook her head.

"Out."

"The response is strongest there."

"Exactly."

"The phase structure survives."

"Maybe because you imposed it."

Ian leaned back.

"The counter-field was calculated from local metrology."

"Which makes the output causally entangled with the input."

"We can deconvolve the actuator response."

"Later."

He looked at her.

Sarah continued.

"First pass ends before matched cancellation."

"That leaves less than a hundred milliseconds of useful anomaly growth."

"Then we have less than a hundred milliseconds."

Ian stared at the screen.

The most beautiful data disappeared behind a red exclusion bar.

Sarah said:

"Keep it archived."

"I know."

"We are not deleting inconvenient evidence."

"I know."

"Good."

Ian marked the interval:

PRIMARY CROSS-DOMAIN TEST WINDOW: PRE-CANCELLATION ONLY

Everything after that remained available for a separate response-function analysis.

Not fingerprint discovery.

The Geneva record had its own contamination.

Quench onset changed local electromagnetic conditions.

RF corrections moved phase.

Fast correctors altered beam orbit.

The beginning of magnet current sharing introduced additional electrical structure.

Some channels saturated.

Others remained clean.

Ian built a sensor map.

Sarah stood behind him.

"Independent channels first."

"Phase metrology."

"Yes."

"Optical proper-length monitors."

"Yes."

"Fast actuator readback?"

"Only as a marker. Not a discovery channel."

"Protection counter?"

"Timing anchor."

Ian nodded.

They excluded channels whose response depended directly on the counter-field command.

What remained was less impressive.

Three local phase loops.

Two optical path monitors.

One clean propagation-delay series.

Several event anchors.

Sarah looked at the reduced list.

"That is the third clock."

Ian looked dissatisfied.

"It's barely a machine."

"It's barely contaminated."

They began with time scale.

Not alignment.

Each domain had to determine its own characteristic frequency independently.

For the astronomical data, they used the discrete-data posterior already frozen in Scene One of the analysis protocol.

$$ f_{\mathrm{astro}} \approx (1.19 \pm 0.06) \times 10^{-7},\mathrm{Hz} $$

For the PTA data:

$$ f_{\mathrm{PTA}} \approx (1.1 \pm 0.2) \times 10^{-7},\mathrm{Hz} $$

The Geneva record lived in another universe of scale.

Its characteristic mode existed in the local phase data at a frequency many orders of magnitude higher.

Ian fitted it without opening the optical values on the same screen.

No shared prior.

No expected ratio.

No attempt to make the number convenient.

Sarah read the result.

"Stable?"

"Across sensor subsets."

"How stable?"

Ian showed her.

The central value moved slightly when one optical path monitor was removed.

The uncertainty widened.

The primary mode remained.

Sarah nodded.

"Freeze it."

Ian saved the Geneva posterior.

Hash.

Print.

Only then did he reopen the astronomical value.

The ratio between the two characteristic frequencies defined the only allowed time-scale transformation.

$$ \Lambda_t = \frac{f_{\mathrm{Geneva}}}{f_{\mathrm{astro}}} $$

Sarah pointed at the equation.

"That gets locked."

"Yes."

"No fitting it later."

"Yes."

"No nudging until peaks line up."

"Yes."

"No local stretch."

"Absolutely not."

Ian wrote beneath it:

GLOBAL DILATION FACTOR DETERMINED FROM INDEPENDENT FREQUENCY ESTIMATES.

Then:

FROZEN BEFORE SHAPE COMPARISON.

Sarah signed the page.

Ian did too.

The next problem was phase.

The three instruments had no shared absolute epoch.

A pulse arriving at a radio telescope did not carry the same phase origin as a photon centroid measured by JWST or a phase residual inside an accelerator tunnel.

Therefore a constant phase offset was unavoidable.

One.

Not a function of time.

Not a piecewise shift.

One number.

Amplitude was similar.

The units differed completely.

Nanoradians.

Microseconds.

Dimensionless local phase residual.

Absolute amplitudes could not be directly compared without a physical response model.

So the first structural comparison would normalize amplitude.

Sarah wrote the allowed degrees of freedom.

1. Global time dilation — fixed from independent characteristic frequencies

2. One amplitude normalization per observable family

3. One constant phase offset

Then:

NO LOCAL TIME WARPING

NO FREQUENCY TUNING AFTER FREEZE

NO PIECEWISE PHASE ADJUSTMENT

NO MACHINE-LEARNING ALIGNMENT

Ian looked at the last line.

"You added that for drama."

"I added it because somebody will ask."

"We aren't using machine learning."

"Exactly."

She underlined it.

Ian chose a constrained maximum-likelihood comparison.

Sarah approved the method only after he removed three parameters.

The first version allowed separate phase offsets for the first and second harmonic.

"No."

"They may have different instrument response."

"Then you're fitting instrument response."

"Which is real."

"And not independently known."

Ian deleted the parameter.

The second version allowed a small correction to the global dilation.

Sarah pointed at it.

"What is that?"

"Frequency uncertainty."

"You already have a posterior."

"I need to marginalize over it."

"Marginalize over the frozen posterior, yes. Do not fit a new best ratio against the shape."

Ian rewrote the implementation.

The third version allowed a quadratic temporal drift.

Sarah simply stared at him.

He deleted it without argument.

"Good," she said.

"I hadn't defended it."

"You were going to."

They transformed each dataset into a dimensionless cycle coordinate.

$$ u = f_{\mathrm{char}} t $$

One unit of u represented one characteristic cycle in that dataset.

This did not claim the systems evolved at the same physical speed.

It allowed them to compare the ordering of structures once the independently measured global scale difference had been removed.

The astronomical data remained sparse.

Ian did not interpolate missing epochs.

Instead the Geneva reduced model was evaluated only where astronomical measurements actually existed.

Sarah insisted on the same principle for PTA.

"No invented samples."

"I know."

"Say it."

"No invented samples."

"Good."

The screen displayed only points.

No connecting curve.

Ian hated how little there was to look at.

The first shape comparison was poor.

Ian stared at the result.

Sarah leaned closer.

"How poor?"

"Rejected."

"Good."

He ignored her.

The primary extrema roughly aligned.

The secondary structure did not.

The astronomical residual showed a shoulder where Geneva showed a sharper inflection.

Ian checked the code.

Correct.

Checked the frozen scale.

Correct.

Covariance.

Correct.

Sensor selection.

Correct.

He felt the old instinct rising.

Maybe one Geneva channel should be restored.

Maybe the astronomical low-order model was too restrictive.

Maybe a small nonlinear timing correction—

Sarah said:

"No."

Ian had not spoken.

He looked at her.

"You were about to change something."

"The mismatch may be instrument response."

"Then model instrument response from independent calibration."

"We don't have one for spacetime geometry."

"Then the mismatch stays."

Ian leaned back.

The candidate common fingerprint appeared to be dying.

For fifteen minutes neither spoke.

Then Sarah asked:

"What exactly are you comparing?"

"Normalized residuals."

"Physical quantities?"

"Different."

"Derivatives?"

Ian stopped.

Sarah pointed at the PTA column.

"A timing residual may be an integral response to an underlying frequency shift."

He looked at the optical column.

"And astrometric displacement may project another component of the same field."

"Yes."

"So direct waveform equality was never physically justified."

Ian stared at the failed comparison.

Not a bad result.

A bad test.

He erased the heading:

WAVEFORM MATCH

And replaced it with:

DECOMPOSITION

Sarah nodded.

"Now we're doing physics."

They stopped comparing traces.

Instead they asked what reduced features could be measured independently in all three domains.

Not absolute amplitude.

Not absolute time.

Not image morphology.

They settled on a small feature set.

Primary characteristic frequency.

Secondary-to-primary mode ratio.

Third-to-primary mode ratio where measurable.

Relative phase between dominant modes.

Fractional position of the secondary extremum within one characteristic cycle.

Rise-to-relaxation asymmetry.

For Geneva, these came from local phase and propagation-delay measurements.

For astrometry, from discrete centroid observations under the frozen phenomenological basis.

For PTA, only the lowest-order quantities were measurable with useful uncertainty.

Sarah wrote:

PTA IS A VALIDATION DOMAIN, NOT THE HIGH-RESOLUTION FINGERPRINT DOMAIN.

Ian looked at it.

"Because sampling is too sparse."

"Exactly."

"So the main structural comparison is Geneva versus optical."

"With PTA checking the low-frequency temporal family."

"Yes."

That was less symmetrical than Ian wanted.

Reality rarely arranged experiments for aesthetics.

The harmonic ratios were first.

The second-to-primary mode ratio in Geneva remained near two.

The astronomical result remained compatible.

Too common.

The third remained near three.

Also common.

Sarah dismissed both as weak evidence.

Ian agreed.

Then phase.

The relative phase between the primary and secondary components had survived the earlier rough analysis.

Now they recalculated it under the reduced, pre-cancellation Geneva window.

$$ \Delta\phi_{21,G} \approx 1.36\ \mathrm{rad} $$

The uncertainty depended on channel selection.

Ian propagated it.

The optical fit:

$$ \Delta\phi_{21,O} \approx 1.4 \pm 0.2\ \mathrm{rad} $$

Compatible.

Sarah said:

"Still not distinctive enough."

Ian nodded.

They moved to the position of the secondary shoulder within the normalized cycle.

Geneva:

an awkward fractional phase.

Optical:

similar.

Then rise-relaxation asymmetry.

Again similar.

Individually, none was extraordinary.

Together, they began to form a shape vector.

$$ \mathbf{v} = (r_2,\ r_3,\ \Delta\phi_{21},\ \xi_2,\ \eta) $$

Where:

r_2 was the second-to-primary mode ratio.

r_3 the third-to-primary ratio.

Delta_phi_21 the relative phase.

xi_2 the fractional location of the secondary feature.

eta the rise-relaxation asymmetry.

Sarah looked at it.

"Five numbers."

"Five reduced observables."

"Do not call them invariants."

Ian had been about to.

He changed the file name.

The first normalized comparison returned:

SHAPE COHERENCE: 0.99998

Ian stopped.

Sarah looked at the value.

Then at Ian.

"No."

"What?"

"No reaction until we know what the number means."

"It means the reduced feature vectors are nearly collinear after the frozen scale transformation."

"That sentence is acceptable."

"Correlation of point nine nine nine nine eight."

"Also acceptable."

"It is extraordinary."

"Maybe."

Ian turned toward her.

Sarah pointed at the screen.

"How many dimensions?"

"Five."

"How many are strongly constrained in both domains?"

"Four."

"How many contain near-harmonic ratios?"

"Two."

Ian's excitement weakened slightly.

Sarah continued.

"And the covariance?"

"Included."

"Shared model assumptions?"

"Some."

"So this is not '99.998 percent probability of same origin.'"

"I know."

"Write that."

Ian did.

0.99998 IS A NORMALIZED SHAPE-COHERENCE METRIC.

Then:

IT IS NOT A P-VALUE, POSTERIOR PROBABILITY, OR CAUSATION PROBABILITY.

Sarah nodded.

"Now we ask how often unrelated data can produce it."

The null ensemble became the most expensive computation Ian had run at Coats.

Not because one comparison was difficult.

Because the controls had to preserve the ugly parts.

Astronomical sampling cadence.

Actual covariance.

Mode-search range.

Geneva channel count.

Sensor noise.

The pre-registered feature-extraction process.

Look-elsewhere effects from the candidate fields Ian had searched before A-173.

Model multiplicity from reasonable Geneva decompositions considered before the blind comparison.

Sarah added randomized phases.

Marovic added synthetic astrometric distortions generated through alternative calibration residuals.

Kovacs contributed PTA low-frequency noise realizations for the low-resolution validation layer.

No one was permitted to tune the null after seeing the final tail.

Ian launched the run.

One million realizations.

Estimated completion:

eleven hours.

Thirty-eight minutes later, Rack Two throttled.

The temperature warning appeared.

Ian stood.

"Again?"

Sarah checked the cooling loop.

"Not the filter."

GPU hotspot temperature had crossed the pre-set limit.

Clock speed dropped automatically.

The run slowed.

One worker process aborted.

Ian looked at the partial result.

Sarah closed the window.

"Restart that partition."

"We can resume."

"After verifying the hardware."

"The computed trials are valid."

"Probably."

"Checksums—"

"Ian."

He stopped.

They inspected the rack.

A circulation fan in the rear plenum had developed intermittent bearing drag.

No data corruption.

No timing effect on the source datasets.

No scientific phase coherence had been "lost."

The computation had simply slowed and one process had failed.

They replaced the fan.

Verified memory.

Reran the aborted partition from its last validated checkpoint.

The null ensemble continued.

Ian looked at Sarah.

"Happy?"

"Very."

"Your standards for happiness are poor."

"My standards are observable."

The result completed after midnight.

Ian and Sarah were upstairs when it finished.

They had obeyed their own rule.

No watching the tail converge.

At 00:41 they entered the Hidden Node together.

The result waited.

Ian sat.

Sarah remained standing.

NULL REALIZATIONS: 1,000,000

REALIZATIONS WITH SHAPE COHERENCE >= 0.99998: 11

Ian did not speak.

$$ p_{\mathrm{false}} \approx 1.1 \times 10^{-5} $$

Sarah leaned toward the screen.

"Under this null."

"Yes."

"With the declared search history."

"Yes."

"With model multiplicity."

"Yes."

"Shared systematics?"

"Only those represented in the controls."

"Good."

Ian looked at her.

"Eleven in a million."

"Under the model."

"Yes."

Sarah's expression had changed.

Only slightly.

She believed the result mattered now.

Ian could tell.

That mattered more than he wanted it to.

They added the PTA constraint.

Not to increase the five-dimensional shape coherence.

The timing archive could not support that precision.

Instead they asked whether null realizations producing Geneva-optical coherence as strong as observed also produced a PTA low-frequency component compatible with the same independently frozen temporal band and broad sky support.

Eleven candidates remained from the million.

Nine failed the PTA frequency compatibility test.

One failed directional support.

One survived.

Ian stared at the screen.

Sarah said:

"Do not divide one by a million and call it the probability of coincidence."

"I wasn't going to."

"You were thinking it."

"Sampling uncertainty alone—"

"Good."

They expanded the targeted tail with importance sampling rather than pretending one survivor defined a precise probability.

The final false-alignment estimate remained small.

But not metaphysically small.

Sarah wrote:

JOINT STRUCTURAL CORRESPONDENCE IS DIFFICULT TO REPRODUCE UNDER TESTED NULLS.

Ian added:

COMMON PHYSICAL CAUSE NOT ESTABLISHED.

They both signed it.

The next morning, Marovic read the result remotely.

She did not say anything for almost a minute.

Then:

"Show me the feature definition history."

Ian sent it.

She read.

"Frozen before the 0.99998 result?"

"Yes."

"Any features discarded afterward?"

"No."

"Any transformed because they matched poorly?"

"No."

Sarah answered before Ian could.

"We attempted raw waveform similarity first. It failed. We abandoned the test because physical response functions differ between observables. That failure is preserved in the log."

Marovic nodded.

"Good."

Ian looked at her.

"You all enjoy failed tests too much."

"Because failed tests make surviving tests expensive."

She read the null construction.

"Eleven in a million."

"Under that ensemble."

"Don't become modest now."

Sarah said:

"We're training him."

Marovic ignored them.

"What about wavelength?"

Ian opened the optical constraints.

"No detected chromatic dependence within current precision."

"Radio?"

"PTA candidate component does not show the dispersion scaling expected for interstellar plasma."

"Direction?"

"Compatible, broad."

"Parallax-like distance?"

"Stable."

"Geneva direction?"

"Compatible under the independent local-axis reconstruction."

Marovic became still.

"You realize how much of the argument is now orthogonal."

Ian nodded.

That was the important word.

Not independent in an absolute sense.

Orthogonal.

Different observables failing in different ways.

Sterling received the result that afternoon.

He requested the reduced package.

Not the full Hidden Node environment.

Ian sent:

feature definitions,

frozen preprocessing hashes,

Geneva local provenance,

limited central cross-check,

astrometric reduced statistics,

PTA reduced posterior,

null construction,

failed-test log.

Sterling called two hours later.

Sarah answered.

His face appeared.

He did not congratulate them.

"Your point-nine-nine-nine-nine-eight."

Ian waited.

"It is a similarity metric."

"Yes."

"Not a significance."

"Yes."

"Your false-alignment estimate depends on the null family."

"Yes."

"Your Geneva window excludes the strongest period of counter-field intervention."

"Intentionally."

"Good."

Sterling read something off-screen.

"The time scaling."

"Fixed from independently fitted characteristic frequencies."

"Before feature comparison?"

"Yes."

"How much freedom after?"

Ian answered.

"Amplitude normalization and one constant phase offset."

"No local time warping?"

"No."

"Nonlinear frequency correction?"

"No."

"Machine-learning alignment?"

Sarah looked at Ian.

He said:

"No."

Sterling remained silent.

Then:

"That is considerably more interesting."

Ian felt something tighten in his chest.

He did not show it.

Sterling continued.

"Now tell me what you think it means."

Ian looked at the three columns.

Optical.

PTA.

Geneva.

"The same reduced dynamical structure appears in the Geneva local event and the astronomical anomaly under a global scale transformation fixed independently of shape."

Sterling waited.

"The PTA archive independently supports a low-frequency temporal component in the same band and broad sky region."

Sterling waited again.

Ian knew what he wanted.

He said:

"This is evidence that the three datasets may be sampling one underlying physical process."

"May."

"Yes."

"Does it prove Geneva generated the astronomical anomaly?"

"No."

"Does it prove the astronomical anomaly generated Geneva?"

"No."

"Does it prove both share one source?"

"No."

Sterling nodded.

"Then we agree."

Ian looked at him.

"On what?"

"That you have found a fingerprint candidate."

Sarah leaned slightly forward.

Ian noticed Sterling's word.

Candidate.

Not fingerprint.

Not yet.

After the call, Ian stood in front of the Hidden Node wall.

The word bothered him.

candidate

Sarah entered behind him.

"He's right."

"I know."

"What is missing?"

Ian looked at the feature vector.

Mode ratios.

Relative phase.

Secondary feature position.

Rise-relaxation asymmetry.

"They're dynamical descriptors."

"Yes."

"Not invariant under every representation."

"Exactly."

"Another basis could change some of them."

"Yes."

"An instrument response model could alter phase."

"Yes."

Ian looked toward the Geneva closed-loop phase data.

Sarah followed his gaze.

"No."

"I didn't say anything."

"You were about to say topology."

"The local loop closure is measured."

"At Geneva."

"Yes."

"The optical field—"

"Is sparsely sampled."

"Exactly."

Ian turned away.

"We need more sky geometry."

"Yes."

"Enough to reconstruct transport around a closed contour."

"Maybe."

"And then compare loop structure."

"If the data support it."

"Winding."

Sarah pointed at him.

"No."

Ian sighed.

"Closed-loop phase structure."

"Thank you."

The next weeks changed the project.

Until then, additional telescope observations had been useful.

Now they were necessary for a specific reason.

Not more significance.

Geometry.

Ian and Marovic identified four background reference sources around the existing anomaly region whose positions could, in principle, sample a closed angular path without interpolating across an intolerable gap.

One was too faint for useful optical astrometry.

A second had radio structure.

A third entered a poor visibility interval.

The fourth was ideal.

None belonged to Ian.

Telescope committees did.

Again.

He submitted proposals.

Marovic called colleagues.

Sarah contacted the orbital metrology consortium.

Kovacs requested continued PTA analysis.

Sterling did something Ian did not expect.

He endorsed the observing request.

Not Ian's interpretation.

The measurement.

The proposal received priority review.

Ian read Sterling's supporting sentence.

The requested observations address a defined cross-domain calibration question arising from the NGC incident review and subsequent independent astronomical measurements.

Nothing about rupture.

Nothing about new physics.

Nothing false.

The telescope time was approved.

The new optical epoch arrived thirty-seven days later.

The added source closed part of the angular geometry.

Not enough for a full topological claim.

Enough to make the transport reconstruction less dependent on interpolation.

Ian and Sarah reduced it blind.

Centroid.

Timestamp.

Covariance.

Nothing else.

The new vector pointed where the reduced model predicted within uncertainty.

Ian stared at the result.

Sarah did not say anything.

He looked at her.

"Now?"

"Now what?"

"We have another sample."

"Yes."

"Closed contour."

"Not fully."

"Nearly."

"Topology does not care about nearly."

Ian smiled faintly.

"You've been reading."

"I've been surviving you."

They added the point.

The reconstructed local transport field changed less than expected.

The loop integral became constrained enough to distinguish zero from the Geneva-like sign over most of the allowed model family.

Ian felt the old excitement.

Sarah raised one hand.

"Candidate."

He nodded.

"Candidate."

That night, Ian returned alone to the Hidden Node.

Not to analyze.

To look.

The three columns remained.

He read them from left to right.

ASTROMETRY

A ruler across months.

PTA

A clock across years.

GENEVA

A machine clock across milliseconds.

Their absolute scales had nothing in common.

Their instruments had nothing in common.

Their units had nothing in common.

Yet after the time scale was fixed independently, a reduced structure survived.

Not the dramatic waveform.

Not the colors on a plot.

Not the interpretation.

A small set of relationships.

Ian opened his notebook.

At the top he wrote:

DECOMPOSITION RESULT

Then:

The correspondence survives removal of absolute amplitude, absolute time scale, and instrument-specific morphology.

Below:

One independently fixed global dilation factor is sufficient to compare the reduced dynamics.

Then:

No local time warping is required.

He stopped.

The next sentence came easily.

Therefore the same process—

He crossed out the words.

Started again.

Therefore the datasets are consistent with a common underlying dynamical structure.

Better.

Then:

Direction of causation: unknown.

He looked at the sentence.

Left it.

Finally:

Next question: what survives not merely scale, but representation?

He closed the notebook.

That was the boundary between dynamics and topology.

Between resemblance and identity.

Between a pattern that could still be coincidence and one that might carry a conserved structure across three light-years of apparent distance and eleven orders of temporal scale.

Ian switched off the displays.

For once, he did not need to see the plots.

The third clock had done its job.

It had not told them what caused Geneva.

It had done something more disciplined.

It had made the coincidence expensive.

And now they would ask whether geometry could make it impossible.

## Chapter 4: The Rupture Front

### [Scene 1: Topological Invariants Match]

The new source did not complete the loop.

It made the loop measurable.

That distinction took Ian three days to accept.

The additional optical reference lay close enough to the existing astrometric field that its displacement vector reduced the largest interpolation gap by nearly half. The geometry was still sparse. No telescope had drawn a continuous curve through the sky.

They had points.

Points with covariance.

Nothing more.

Sarah stood behind Ian in the Hidden Node while he stared at the reconstructed angular field.

"Don't fill the gap."

"I'm not."

"You've been looking at it for twelve minutes."

"I'm calculating."

"With your eyes."

Ian turned off the visualization.

Only the measured vectors remained as a table.

Sarah nodded.

"Better."

He disliked how often she was right.

The Geneva measurement was easier.

Sector Four had contained actual closed loops.

Three independent phase-metrology paths wrapped around the interaction region through different optical and electrical routes. Their absolute phases had never mattered. What mattered was whether phase increments summed to zero when carried around a closed path.

Before the anomaly:

they did.

Within calibration.

During the incident:

they did not.

The measured closure was:

$$ \Delta\Phi_{\mathrm{loop}} = \sum_k \Delta\phi_k $$

For an ordinary, simply connected calibration field, the sum should return to zero apart from known instrumental offsets.

The Geneva residual did not.

Ian had spent three years calling that nonzero sum a winding number.

Sarah had spent three days refusing.

"What is the instrument measuring?" she asked again.

"Closed-loop phase accumulation."

"Good."

"What does the MSV model call the corresponding normalized quantity?"

"A winding-like index."

"Like."

Ian frowned.

"The integral approaches an integer multiple of two pi."

"Under your phase reconstruction."

"Yes."

"With uncertainty."

"Yes."

"So write that."

He did.

$$ \nu_{\mathrm{eff}} = \frac{1}{2\pi}\oint_C \nabla\phi \cdot d\mathbf{l} $$

Then:

Geneva: nu_eff consistent with +1 during peak pre-cancellation interval, within reconstruction uncertainty.

Sarah pointed.

"That is acceptable."

Ian looked at her.

"It is winding."

"It is data consistent with winding."

"Eventually you have to let nouns mean things."

"Eventually the data have to earn them."

Astronomy was harder.

There was no phase sensor in Perseus.

There were apparent angular displacements of background sources across time.

To build a closed-loop quantity, Ian had to infer a local transport map over the sky patch.

That was where overreach could enter.

If he interpolated too aggressively, the loop structure would simply reflect the interpolation prior.

Sarah insisted on three independent reconstruction families.

Piecewise linear transport on the measured angular mesh.

Minimum-curvature field consistent with covariance.

Gaussian-process transport with hyperparameters fixed on synthetic calibration fields, not the anomaly.

Ian disliked the redundancy.

Marovic demanded a fourth.

No continuous field at all.

Only a discrete polygonal circulation computed from directly measured neighboring displacement differences.

That one was ugly.

Ian trusted it most.

For the polygonal estimator:

$$ \Gamma_{\mathrm{obs}} = \sum_j \Delta\boldsymbol{\theta}_j \cdot \Delta\mathbf{l}_j $$

It was not a true continuum line integral.

It was a finite-sampling proxy.

Ian labeled it as such.

They propagated each source covariance through the sum.

Repeated the calculation across all allowed source-orderings consistent with the measured geometry.

Then randomized the displacement directions under the null.

The observed sign persisted.

The magnitude was uncertain.

The sign was not.

Sarah looked at the result.

"Say the careful version."

Ian read from the screen.

"The astrometric field exhibits nonzero discrete circulation around the measured source loop, with the same orientation sign as the Geneva closed-loop phase accumulation under the agreed coordinate convention."

"Better."

"Compatible normalized value."

"How compatible?"

He showed her.

Broadly.

Not enough to call equal.

Enough that zero was disfavored in both datasets under their independent reductions.

Sarah nodded.

"Now we have something."

Ian looked at her.

"Winding."

"Candidate winding."

He sighed.

The next structure came from transport rather than circulation.

In Geneva, the local metrology network allowed them to reconstruct how a small phase displacement changed when carried around different closed sensor paths.

That transformation could be represented as a loop transport operator.

Ian preferred the mathematical word.

Sarah allowed it because the operation was defined directly from measured phase relations.

Holonomy.

Not of spacetime in the full relativistic sense.

Not yet.

Operational holonomy.

For each closed loop, they reconstructed an effective transport matrix.

$$ H_C = \mathcal{P}\exp\left(\oint_C A_\mu,dx^\mu\right) $$

Sarah pointed at the equation.

"The connection A_mu is model-derived."

"Yes."

"So the directly measured quantity is the loop transport matrix reconstructed from the phase differences."

"Yes."

"And the interpretation as a connection holonomy comes after."

"Yes."

"Good."

Ian added a note:

H_C is an effective transport operator inferred from measured loop phase relations; identification with an MSV connection is model-dependent.

Then he computed the eigenvalues.

The absolute matrix elements depended on basis choice.

The eigenvalue spectrum was more stable.

That was what he wanted.

Representation could change.

The spectrum might survive.

Geneva produced one dominant nontrivial eigenphase and two weaker modes.

Not exactly integer-spaced.

Not harmonically trivial.

The ratios remained stable across two sensor-loop constructions.

Ian froze the spectrum.

No astronomy yet.

Marovic joined remotely.

She looked at the Geneva eigenphase spectrum.

"You're going to try to extract that from four stars?"

"Five usable references now."

"That is not the defense you think it is."

"We don't need a full continuum."

"You need enough local transport structure to build a basis-independent observable."

"Exactly."

Marovic stared at him.

"I was criticizing you."

"I know."

Sarah intervened.

"We can estimate a discrete transport operator from the measured displacement mapping between neighboring source directions."

Marovic looked unconvinced.

"With huge covariance."

"Yes."

"And field reconstruction dependence."

"Which is why we use four estimator families."

Marovic read the list.

"Good."

Ian almost objected to the word.

He stopped himself.

The astronomical transport operator was noisier than Geneva by orders of magnitude.

One reconstruction family produced an unstable third mode.

Discarded.

Not because it failed to match Geneva.

Because the estimator did not pass synthetic recovery tests.

The piecewise-linear family retained two useful eigenphases.

The discrete polygonal estimator retained one robust nontrivial mode and a weaker secondary.

The Gaussian-process method produced the cleanest spectrum.

Sarah distrusted it most.

"Why?"

Ian asked.

"Because it looks clean."

"That is not an argument."

"It is an invitation to look at the prior."

They did.

One hyperparameter had been weakly regularizing curvature more strongly than intended.

Ian fixed it.

The spectrum widened.

The central ratios barely moved.

Sarah looked satisfied.

Ian looked annoyed.

The result they eventually accepted was not one spectrum.

It was the intersection of spectra supported across reconstruction families.

The dominant eigenphase ratio remained compatible with Geneva.

The secondary ratio overlapped as well, less strongly.

Ian wrote:

EFFECTIVE HOLONOMY SPECTRUM: CROSS-DOMAIN COMPATIBILITY PERSISTS ACROSS RECONSTRUCTION FAMILIES.

Sarah added:

WITH LARGE ASTRONOMICAL UNCERTAINTY.

Ian let it stay.

The third structure was simpler.

Eigenmode ratios.

They had already used low-order mode ratios in the dynamical comparison.

Now they recalculated them from the transport operators rather than the raw temporal traces.

That mattered.

Temporal waveform harmonics could arise from many ordinary systems.

Geometric transport eigenmodes under different representations were harder to fake by the same mechanism.

Geneva:

three stable modes.

Astrometry:

two robust, one weak.

PTA:

insufficient spatial resolution for the full spectrum.

Sarah insisted they leave PTA out.

Ian agreed.

The ratio of the first two nontrivial transport eigenvalues survived coordinate-basis changes.

The Geneva value:

stable across loop families.

The astrometric value:

compatible within uncertainty.

The third mode:

inconclusive.

Ian wrote:

MODE-2 / MODE-1 RATIO: MATCHES WITHIN CROSS-DOMAIN COVARIANCE.

Then:

MODE-3: NOT RESOLVED ASTRONOMICALLY.

Sarah nodded.

"Keep the failure."

"I know."

By the end of the day, the Hidden Node wall had changed.

The earlier feature vector was gone.

In its place:

CLOSED-LOOP CIRCULATION

EFFECTIVE HOLONOMY SPECTRUM

TRANSPORT EIGENMODE RATIOS

DOMINANT GEOMETRIC AXIS

CHARACTERISTIC TEMPORAL BAND

Five observables.

Not all equally strong.

Not all available in all three datasets.

But none depended on matching one pretty waveform to another.

Ian stood in front of the list.

"This is the fingerprint."

Sarah shook her head.

"Almost."

He looked at her.

"What now?"

"Blind reconstruction from Geneva central data."

"The central package doesn't have enough local phase channels."

"Enough to test the dominant axis and one transport ratio."

"Not circulation."

"Fine."

"It will be weak."

"Fine."

Ian stared at her.

She shrugged.

"You wanted representation independence."

He hated when his own standards returned as work.

Sterling approved the derived-variable request within two hours.

Not additional raw detector data.

Only the right to reconstruct two reduced metrology observables from the limited central package.

Ian and Sarah prepared the test.

No local cartridge values visible.

No astronomical values visible.

Central Geneva only.

Different timestamps.

Different calibration products.

Different reconstruction history.

They extracted:

dominant geometric axis.

one effective loop-transport ratio from the central metrology summary.

Uncertainty was large.

But both agreed with the local cartridge within their independent errors.

Sarah looked at the result.

"Now your local memory is not carrying the entire fingerprint."

Ian nodded.

The distinction mattered.

The cartridge was no longer the sole source of Geneva structure.

The institution's surviving reconstruction preserved part of it independently.

No one had to trust Ian's exile copy alone.

That evening Sterling called.

Sarah answered.

Ian stood beside her.

Sterling read the reduced results in silence.

Then:

"Your terminology."

Ian waited.

"You call this holonomy."

"Effective holonomy."

"Operationally inferred from loop transport."

"Yes."

"Good."

Sterling moved to the next page.

"You call the circulation winding."

"Winding-like index."

"Better."

Ian's expression tightened.

Sterling continued.

"The astronomical reconstruction?"

"Four estimator families."

"Any one dominant?"

"Piecewise linear and discrete polygonal are least assumption-heavy. Gaussian-process gives similar central values with narrower apparent structure but we use the broader cross-family envelope."

Sterling nodded.

"Correct."

Ian said:

"You sound surprised."

"I am surprised."

"By the result?"

"By your restraint."

Sarah looked away.

Ian ignored both of them.

Sterling returned to the report.

"The dominant loop orientation matches."

"Yes."

"The nontrivial transport eigenphase spectrum is compatible."

"Yes."

"The leading eigenmode ratio is compatible."

"Yes."

"Third mode unresolved."

"Yes."

"PTA?"

"Temporal support only. Not enough spatial geometry."

Sterling nodded.

"Then your strongest statement?"

Ian had prepared it.

"The Geneva event and the astronomical anomaly share a reduced geometric structure that survives changes in absolute scale, instrument class, coordinate basis, and multiple reconstruction methods."

Sterling waited.

Ian continued.

"The probability of obtaining the observed joint correspondence under the tested null families is low."

Sterling said:

"Still not causation."

"No."

"Still not proof of a spacetime defect."

"No."

"Still not proof that the astronomical feature is one object."

"No."

Sterling leaned back.

"Then I will sign that statement."

Ian did not move.

Sarah looked at Sterling.

"Publicly?"

"With qualifications."

Ian stared at the screen.

Three years earlier, Sterling had controlled access to the anomaly.

Now he was willing to put his name beside one.

The change unsettled Ian more than opposition would have.

"Why?"

Sterling understood the question.

"Because the evidence changed."

Ian said nothing.

Sterling added:

"That is what institutions are supposed to do."

The call ended.

The statement was released forty-eight hours later.

Not by CERN alone.

Jointly.

The European timing consortium.

Marovic's astrometry group.

The NGC incident-review office.

The language was clinical.

Independent optical astrometry, pulsar-timing residuals, and archived NGC metrology contain statistically nontrivial structures consistent with a common reduced geometric description.

Cross-domain agreement persists in directional support, low-frequency temporal behavior, nonzero closed-loop transport structure, and selected eigenmode ratios.

No causal ordering or physical origin is presently established.

The press ignored the last sentence.

Headlines appeared within an hour.

GENEVA EVENT MAY HAVE DISTORTED SPACE THREE LIGHT-YEARS AWAY

CERN ANOMALY DETECTED IN DEEP SPACE

PHYSICISTS FIND POSSIBLE "SCAR" IN SPACETIME

Ian closed the browser.

Sarah had already stopped reading.

"Expected."

"They're saying Geneva caused it."

"We didn't."

"Sterling didn't."

"No."

"Doesn't matter."

Sarah looked at him.

"It matters."

"To whom?"

"To the people doing the next experiment."

Ian turned away.

He knew she was right.

That did not make the headlines less dangerous.

The press conference was held in Geneva.

Ian attended remotely from Coats.

Sterling stood at the center podium.

Kovacs to his right.

Marovic on another screen.

Sarah beside Ian in Scotland.

The first question came from a science correspondent.

"Dr. Sterling, are you saying the 100 TeV Geneva experiment created a rupture in spacetime?"

Sterling answered without hesitation.

"No."

A murmur passed through the room.

"We are saying that a local metrology anomaly recorded during the NGC incident and a later astronomical anomaly admit statistically compatible reduced descriptions."

"Isn't that the same thing?"

"No."

"Then what is the connection?"

"Observed structural correspondence."

"Cause?"

"Unknown."

Another reporter.

"Dr. Yoo has previously argued for a deterministic geometric interpretation of the Geneva event. Does this validate his theory?"

Ian almost answered.

Sterling did first.

"No."

Ian looked at him.

Sterling continued.

"It validates specific predictions only where those predictions are borne out by measurement. It does not validate a philosophy."

Sarah glanced at Ian.

He did not react.

Another reporter asked:

"Could the astronomical disturbance have caused Geneva rather than the reverse?"

Sterling nodded.

"Yes."

The room became louder.

"Could both come from something else?"

"Yes."

"Then why announce this now?"

Sterling looked directly at the cameras.

"Because multiple independent measurement systems now contain a correspondence that is unlikely to be explained by the systematics tested so far. The observation is mature enough to deserve wider scrutiny. The explanation is not."

Ian wrote the sentence down.

He hated that too.

Therefore he kept it.

After the conference, the Hidden Node felt quieter than usual.

Sarah packed one of her drives.

Ian stood at the wall.

"You're leaving?"

"Tomorrow."

"Why?"

"Because now you need more than analysis."

He looked at her.

"What do you think I need?"

"Someone who can build what your equations ask for."

"Engineering?"

"Materials."

Ian frowned.

"I can build coils."

Sarah smiled.

"No."

"I already have."

"You have built expensive ways to warm superconductors."

"That's not fair."

"It's accurate."

She zipped the case.

"I know someone."

"Who?"

"Aris Thorne."

Ian had never heard the name.

"What does he do?"

"Depends who is funding him."

"Useful."

"Superconducting magnets. Cryogenic power systems. Pulsed-field hardware. Failure analysis."

"Where?"

"Denver."

Ian looked at her.

"United States?"

"Yes."

"Why Denver?"

"Because the person funding him likes mountains, tax structures, and private infrastructure."

Ian understood the next name before she said it.

"Vance."

Sarah looked at him.

"You've heard of him."

"Everyone has."

Marcus Vance.

Infrastructure capital.

Orbital launch.

Data centers.

Energy storage.

Private networks.

A man who seemed to own supply chains rather than companies.

Ian looked back at the geometric results.

"We're not ready."

Sarah finished closing the case.

"Scientifically?"

"Physically."

"Exactly."

That night Ian remained in the Hidden Node alone.

The wall held the full chain.

Optical.

Timing.

Geneva.

Direction.

Frequency.

Circulation.

Transport spectrum.

Eigenmode ratios.

For weeks he had been asking whether the structure survived representation.

Now it did.

Not perfectly.

Not completely.

Enough.

He opened his notebook.

At the top:

STRUCTURAL RESULT

He wrote:

The observed cross-domain correspondence is stronger than waveform resemblance.

Then:

It survives scale reduction.

It survives coordinate-basis changes.

It survives multiple astronomical field reconstructions.

It survives independent Geneva local and partial central reconstruction.

Then:

Common reduced geometry: supported.

He stopped.

The next question was unavoidable.

If the same geometry existed in Geneva and three light-years away, what connected them?

A wave?

A propagating defect?

A static geometry sampled at two locations?

A common external driver?

Something the language of ordinary field propagation did not capture?

Ian opened a fresh page.

He drew a line.

At the left:

GENEVA

At the right:

3.020 ± 0.010 ly

Between them he wrote:

?

Then he looked at the timing data.

The anomaly evolved.

Not instantaneously.

Not at light speed, if the parallax-like distance and apparent chronology were both physical.

There was structure in the delay.

A rate.

He began writing times beneath the line.

Geneva event epoch.

Earliest usable astrometric deviation.

PTA sensitivity window.

Observer baselines.

No assumptions yet.

Only clocks.

He calculated once.

Stopped.

Calculated again.

The implied speed was absurd.

Not faster than light.

Slower.

Much slower.

A fraction of c.

Ian stared at the number.

Then erased it.

Not because it was wrong.

Because he had not yet separated observation from model.

He wrote instead:

IF distance-like geometry is physical

AND IF Geneva is one endpoint of the same propagating structure

THEN a subluminal propagation model may exist.

Beneath it:

NOT OBSERVED.

Then:

MODEL-INFERRED ONLY.

He leaned back.

The word rupture came to him then.

Not wave.

A wave moved through an existing medium.

This looked, in his equations, more like a change in the admissible geometric branch itself.

A front.

A boundary between solutions.

A failure that propagated because the equations no longer supported the old configuration behind it.

Ian did not write the word immediately.

He knew the danger of names.

Names made models feel observed.

He waited.

Then, on the next line:

Candidate nonlinear branch transition.

Under that, smaller:

Working shorthand: rupture front.

He closed the notebook.

For the first time, the astronomical anomaly no longer looked like an echo.

It looked like a moving boundary.

And if the distance model was even approximately right, the boundary had a speed.

Which meant it also had a direction.

And eventually, an arrival time.

### [Scene 2: The Calculus of Rupture]

The speed came from an angle.

Ian disliked that.

Speeds were supposed to come from distance and time.

This one required both, but neither had been measured in the ordinary way.

At 08:21, he stood in the Hidden Node beneath Coats Observatory and stared at five numbers Sarah had written on separate sheets of paper.

3.020 ± 0.010 ly

1.15° ± 0.09°

97 ± 5 days

T0 + 3.04 years

GENEVA: T0

Sarah placed the last sheet on the table.

"Start again."

"We have done this twice."

"Third time."

Ian looked at her.

"Why?"

"Because the second time you called something a front."

"It is the simplest model."

"Then you can survive explaining it again without the noun."

Ian exhaled.

Marovic watched from one screen.

Kovacs occupied another.

Sterling had declined the first hour of the meeting.

His message contained six words.

Call me when you have propagation.

Ian had found the wording irritating.

Sarah had found it funny.

Now Ian pointed to the first sheet.

"The parallax-like astrometric term maps the disturbance to a characteristic distance of three point zero two light-years, if the geometric interpretation is physical."

Sarah nodded.

"Good."

He pointed to the second.

"The spatial phase gradient across the measured astrometric field gives a characteristic angular scale of approximately one point one five degrees under the lowest-order transport model."

Marovic interrupted.

"Not an observed wavelength."

"I know."

"Say it."

Ian looked at her image.

"It is not an observed wavelength."

"Thank you."

He continued.

"The mapping from angular scale to transverse physical scale is model-dependent."

$$ \lambda_{\mathrm{model}} \approx D\theta $$

Sarah nodded.

"Small-angle approximation."

"Yes."

At three point zero two light-years and an angular scale of roughly two hundredths of a radian, the inferred transverse scale was about six hundredths of a light-year.

Ian wrote it.

$$ \lambda_{\mathrm{model}} \approx 0.061\ \mathrm{ly} $$

Then he pointed to the third sheet.

"The discrete astrometric observations support a characteristic temporal period near ninety-seven days."

$$ T \approx 97 \pm 5\ \mathrm{days} $$

Kovacs spoke.

"And the PTA?"

"Supports the same low-frequency band with much larger uncertainty. It does not improve the period estimate."

"Good."

Ian hated how much of science had become people saying good whenever a measurement became less impressive.

He continued.

"If the angular structure represents a propagating spatial phase pattern, then the characteristic pattern speed is the spatial scale divided by the temporal scale."

$$ v_{\mathrm{model}} \approx \frac{\lambda_{\mathrm{model}}}{T} $$

He entered the values.

The number appeared.

$$ v_{\mathrm{model}} \approx 0.23,c $$

With propagated uncertainty from the distance, angular scale, temporal fit, and reconstruction family:

$$ v_{\mathrm{model}} \approx (0.23 \pm 0.02),c $$

No one spoke for several seconds.

Sarah finally said:

"Now tell us what that number is not."

Ian looked at her.

"It is not a directly tracked object velocity."

"Good."

"It is not measured radial motion."

"Good."

"It is not proof that anything is physically propagating."

"Good."

"It is the pattern speed implied by a specific propagating-structure model fitted to the observed spatial and temporal scales."

Sarah nodded.

"Now I believe you understand your own number."

Ian looked at the five sheets again.

The fourth one bothered him more.

T0 + 3.04 years

That was the first optical epoch in which the anomaly could be distinguished from the historical baseline without relying on later measurements.

Not the first time the phenomenon necessarily existed.

The first time they could see it.

They had made that distinction repeatedly.

Now the distance changed its meaning.

If the three-point-zero-two-light-year distance behaved like an ordinary propagation distance for the photons carrying the astronomical measurement, then the light Ian received at that first anomalous epoch had left the inferred region roughly three point zero two years earlier.

He wrote:

$$ t_{\mathrm{emit}} \approx t_{\mathrm{obs}} - \frac{D}{c} $$

Sarah watched him.

Ian substituted.

First robust anomalous optical epoch:

approximately T0 + 3.04 years.

Light-travel correction:

approximately 3.02 years.

Retarded source epoch:

approximately T0 + 0.02 years.

Ian did not circle the result.

He had learned something.

Marovic leaned toward her camera.

"Uncertainty."

Ian propagated it.

The optical onset itself was not known to a few days. Sparse sampling dominated.

The correct statement was not:

The distant event occurred 7.3 days after Geneva.

It was:

The inferred retarded onset is statistically consistent with the Geneva epoch within the current temporal resolution.

Sarah wrote that sentence on the wall.

Then beneath it:

CONSISTENT WITH ≠ SIMULTANEOUS

Ian looked at her.

"I know."

"That one isn't for you."

"Who?"

"Future you."

Kovacs spoke from the timing screen.

"The PTA archive doesn't give you an earlier onset?"

"No."

"Why not?"

Ian answered.

"Array sensitivity degrades backward. The shared component becomes indistinguishable from red noise and sampling uncertainty."

"So the PTA cannot establish that the phenomenon began at Geneva."

"No."

"Can it establish that it didn't?"

"No."

"Good."

Ian looked at Sarah.

"Do you have to train everyone?"

"No. Some people arrive trained."

Sarah almost smiled.

The coincidence remained.

Geneva.

A distant astronomical structure at a model-dependent distance of three point zero two light-years.

An independently reconstructed geometric fingerprint.

And a retarded onset that, within the limitations of sparse observations, mapped back close to the date of the NGC incident.

Ian wrote three hypotheses.

A — Geneva seeded the distant disturbance.

B — The distant disturbance produced or triggered Geneva.

C — Geneva and the distant disturbance are both responses to a third process.

Sarah looked at the list.

"Anything else?"

Ian added:

D — Structural correspondence is real, causal relation is not.

Marovic nodded.

"Keep D."

Ian stared at it.

"The temporal coincidence makes D less attractive."

"Less attractive is not eliminated."

"I know."

Sarah pointed at A.

"Explain your preferred model."

Ian remained silent for several seconds.

Then:

"The simplest causal model is that the Geneva collision seeded the fault."

Sarah's face changed.

Not because the sentence surprised her.

Because he had finally said it without qualification.

She asked:

"Can you prove the direction of causation?"

Ian looked at the Geneva record.

Then at the astrometric timeline.

"No."

Sarah waited.

Ian continued.

"Not from this dataset alone."

"Then your sentence?"

"A model."

"Your preferred model."

"Yes."

"Why?"

Ian turned toward the whiteboard.

"Because Geneva contains the first high-amplitude local manifestation we have instrumented. Its reduced geometry matches the remote anomaly. The remote retarded onset is consistent with the Geneva epoch. And the MSV equations admit a branch transition in which a locally forced configuration can connect to a nonlocal topological state."

Marovic frowned.

"That last part is doing enormous work."

"Yes."

"Did Geneva demonstrate nonlocal connection?"

"No."

"Then you don't get it for free."

"I don't."

Sarah nodded.

"Good."

Ian left hypothesis A at the top.

He did not label it TRUE.

Sterling joined at 09:03.

He appeared without greeting.

"Do you have propagation?"

Sarah answered.

"We have a model-dependent pattern speed."

Sterling looked at Ian.

"Number?"

"Point two three c. Uncertainty approximately point zero two under the current model family."

Sterling's expression remained neutral.

"Observed?"

"Inferred."

"Radial?"

"No."

"Transverse?"

"Derived from angular phase scale mapped through the parallax-like distance."

"Then you do not have a front."

Ian's jaw tightened.

"We have a propagating-structure solution."

"One of how many?"

"Four broad causal classes."

"Then you do not have a front."

Sarah looked at Ian.

He did not argue immediately.

Sterling continued.

"What happens in the model?"

Ian brought up the MSV effective branch diagram.

Not the astronomical data.

The equations.

The ordinary solution occupied one stable region of parameter space.

Small perturbations propagated as finite-energy disturbances and decayed or dispersed.

Above a critical combination of phase curvature and coherent geometric stress, a second nonlinear branch became available.

Not a conventional wave moving through unchanged spacetime.

A change in which geometric solution remained dynamically admissible.

Ian pointed.

"Below this threshold, the disturbance remains perturbative."

"Energy?"

"Finite."

"Stress-energy?"

"Finite."

Sterling nodded.

"Good. Do not call it massless."

"I wasn't going to."

Sarah glanced at Ian.

He had been going to.

Ian continued.

"At the threshold, the low-amplitude solution becomes unstable. The system transitions onto this branch."

A curve diverged from the ordinary solution.

Not to infinity.

To a new state.

"Once on the branch, the perturbation no longer behaves like a freely dispersing linear mode. Its leading boundary propagates with a characteristic velocity set by the nonlinear coupling and local state."

Sterling looked at the screen.

"And your point two three c corresponds to?"

"The observed phase-pattern speed if this is the correct branch."

"If."

"Yes."

"Then label it."

Ian changed the screen title.

MODEL-INFERRED NONLINEAR BRANCH

Sterling nodded.

"Now continue."

The equations did not say rupture.

Ian did.

He explained why.

A crack in a material did not consist of one atom traveling through the object.

It was a moving boundary between material that had retained one configuration and material that had entered another.

A combustion front was not one molecule flying at flame speed.

A phase transition could travel far more slowly than the microscopic interactions supporting it.

The model suggested something analogous.

The disturbance was not an object launched from a point and flying toward Earth.

It was a propagating boundary between geometric branches.

Sarah stopped him.

"Analogy."

"Yes."

"Not mechanism."

"Yes."

Sterling said:

"Then 'rupture' is public poison."

"I don't intend it for the paper."

"What do you intend?"

"Nonlinear branch front."

Marovic laughed.

"No journalist will print that."

"Good."

Sarah looked at Ian's notebook.

"What do you call it?"

He hesitated.

"Rupture front."

Sterling closed his eyes briefly.

"Of course."

The dangerous calculation came next.

Ian had done it alone the previous night.

He had not shown Sarah.

She knew immediately.

"You already calculated arrival."

He did not answer.

"Of course you did."

Sterling looked at them.

"Arrival of what?"

Sarah pointed at Ian.

"His model."

Ian opened a fresh screen.

He began again rather than displaying his private calculation.

If the remote structure initiated near the Geneva epoch—

if.

If the three-point-zero-two-light-year distance represented the source-region separation—

if.

If the same nonlinear branch had propagated from that region toward the Solar System at approximately point two three c—

if.

Then the total source-to-Earth propagation time would be:

$$ t_{\mathrm{total}} \approx \frac{D}{v_{\mathrm{model}}} $$

Using the current central values:

$$ t_{\mathrm{total}} \approx 13.1\ \mathrm{years} $$

No one moved.

The Geneva incident had occurred approximately three and a half years earlier.

Ian subtracted elapsed time.

$$ t_{\mathrm{remaining}} \approx \frac{D}{v_{\mathrm{model}}} - t_{\mathrm{elapsed}} $$

The result appeared.

approximately 9.6 years

Sarah leaned toward the screen.

"Uncertainty."

Ian entered the current speed range and the distance uncertainty.

The interval widened.

Not days.

Not months.

More than a year.

He wrote:

WORKING MODEL ARRIVAL: ~9.6 years from present

CURRENT UNCERTAINTY: roughly ±1 year, dominated by branch-speed interpretation

Sterling looked at the words.

"Delete 'arrival.'"

Ian turned.

"Why?"

"Because nothing has arrived."

"It is a model projection."

"Then call it one."

Ian changed the heading.

MODEL-PROJECTED EARTH INTERCEPT

Sterling nodded.

Sarah pointed at the time.

"And no countdown clock."

"I didn't put one."

"You were going to."

Ian looked at her.

"Approximately one hundred and fifteen months."

Sarah stared at him.

"Do not say that outside this room."

"Why?"

"Because people hear months as a schedule."

"It is a schedule."

"No."

She pointed at the ±1 year.

"It is a hypothesis with a calendar attached."

Ian looked at the screen.

The distinction did not reduce the number.

Nine and a half years.

A child could begin primary school and nearly finish it.

A reactor could be designed.

A bridge could be built.

A government could change twice.

Or three times.

A scientific career could disappear.

It was also not long enough.

Not for what the equations implied.

Kovacs was the first to ask.

"What happens if the nonlinear branch reaches Earth?"

Ian did not answer immediately.

Sterling looked at him.

"Only what the model supports."

Ian nodded.

He changed displays.

No image of a destroyed planet.

No simulation of cities breaking.

Only geodesics.

Two initially neighboring trajectories in the ordinary branch remained nearly parallel.

In the nonlinear branch they began to diverge under the modified connection.

$$ \frac{D^2 \xi^\mu}{D\tau^2} = -R^\mu_{\ \nu\alpha\beta}u^\nu\xi^\alpha u^\beta $$

Sterling looked at the equation.

"Geodesic deviation."

"Yes."

"What magnitude?"

"Unknown at the nonlinear front. We have no direct high-amplitude astronomical measurement."

"So?"

"At sufficiently large curvature gradient, neighboring parts of an extended object would be assigned increasingly incompatible free-fall trajectories."

Sarah said:

"Mechanical strain first."

"Yes."

"Not nuclear disintegration."

"No."

"Molecular bonds?"

"Only if the differential acceleration across bond scales exceeds their restoring forces. We have no measurement establishing that regime."

Sterling nodded.

"Keep it that way."

Ian moved to another graph.

The low-amplitude precursor seen astronomically lay far below the critical branch in the current reconstruction.

Finite energy.

Finite stress.

No evidence that it could directly tear matter.

The danger came from extrapolating the nonlinear solution.

That distinction mattered.

Kovacs asked:

"So the thing you currently observe is not the destructive state."

"Correct."

"What is it?"

Ian looked at the graph.

"Possibly a precursor. Possibly the low-amplitude field around a branch transition. Possibly something else."

Sarah said:

"Good."

Ian ignored her.

Marovic folded her arms.

"Let me understand the geometry."

Ian nodded.

"We observe photons today from a region about three light-years away."

"Under the parallax-like model."

"Yes."

"Those photons show a disturbance whose retarded onset maps back approximately to Geneva time."

"Within sparse-sampling uncertainty."

"And you are proposing that a slower nonlinear front may have left that region at roughly the same time."

"Yes."

"Which means the light announcing the event outran the front."

"Of course."

"And by the time we see the source anomaly, the hypothetical front has already been traveling toward us for about three years."

Ian nodded.

"Exactly."

Marovic stared at the screen.

"So we are not seeing where the front is now."

"No."

That was the sentence.

Sarah wrote it.

WE ARE NOT OBSERVING THE CURRENT FRONT POSITION.

The room became quieter.

The parallax-like measurement located the astronomical region whose light carried the anomaly.

If a slower branch had been propagating toward Earth since the inferred source epoch, then its current position would already be much closer.

Not observed.

Calculated.

Ian made that explicit.

$$ D_{\mathrm{remaining}} \approx D - v_{\mathrm{model}}t_{\mathrm{elapsed}} $$

At the central values:

roughly two point two light-years remained.

Again:

model.

Not measurement.

Sarah added another sentence.

CURRENT FRONT DISTANCE: MODEL EXTRAPOLATION ONLY.

Ian nodded.

That one stayed too.

Sterling looked at the timeline.

Then at Ian.

"There is a problem."

"Several."

"Your causal model requires the remote branch initiation and Geneva to share an epoch despite ordinary light-travel separation."

"Yes."

"So Geneva cannot conventionally signal the distant region at or below c."

"No."

"Yet you call Geneva the seed."

"The local NGC state may have coupled through the topological configuration we measured."

"Measured?"

Ian stopped.

Sterling waited.

"We measured a candidate closed-loop transport structure compatible with the astronomical geometry."

"Not a three-light-year connection."

"No."

"Then do not smuggle one in."

Ian looked away.

Sarah remained silent.

Sterling continued.

"The simplest causal model is only simple after you assume the most extraordinary part."

Ian knew.

He hated that he knew.

"The local and remote structures may be manifestations of one connected state."

"May."

"Yes."

"Or the remote event may have driven Geneva through some mechanism you do not understand."

"Yes."

"Or both may be driven by something outside the observed geometry."

"Yes."

Sterling leaned back.

"Good."

Ian looked at the model-projected intercept.

"None of those alternatives remove the branch-speed result."

"No."

Sarah spoke.

"They may remove the assumption that the branch is moving toward us."

That stopped Ian.

He turned.

"The sign of the phase gradient—"

"Constrains evolution across the observed field."

"And Geneva orientation."

"Constrains directional compatibility."

"The branch solution—"

"Is a model."

Ian stared at her.

Sarah continued.

"Can the data distinguish a front moving radially toward us from a source geometry evolving in place?"

Ian did not answer.

He opened the equations.

Checked the projection.

The astrometric field contained transverse phase evolution.

The parallax-like term located the region.

The PTA supplied temporal support.

None directly measured radial motion.

The inward branch was preferred because it connected the source region to Geneva under his model.

Which meant the radial direction depended partly on the causal interpretation he had not proven.

Ian sat down.

"No."

Sarah waited.

"Not uniquely."

The nine-point-six-year estimate seemed to fade on the screen.

Not disappear.

Become conditional.

Sterling said:

"Then conditionalize it."

Ian added to the heading:

IF INWARD-PROPAGATING BRANCH MODEL IS CORRECT

Above:

MODEL-PROJECTED EARTH INTERCEPT: ~9.6 years

Sarah nodded.

The danger remained.

The certainty did not.

For the next four hours, they tried to destroy the inward model.

Static source geometry.

Failed to reproduce the temporal phase gradient without increasing free parameters substantially.

Expanding spherical structure.

Fit almost as well.

But predicted angular evolution at the next epoch differently.

Transverse-moving sheet.

Possible.

Required a peculiar orientation.

Local periodic source.

Could reproduce the ninety-seven-day component.

Failed the transport-eigenmode correspondence unless separately tuned.

Common-reference pathology.

Already constrained.

Unknown third-source model.

Unfalsifiable in its generic form.

Sarah refused to let it count as an explanation.

"An empty box labeled 'something else' is not a predictive model."

Ian looked at her.

"You added OTHER to the wall."

"As a warning. Not a paper."

They finished with three viable phenomenological classes.

1. INWARD NONLINEAR BRANCH

2. EXPANDING / OBLIQUE GEOMETRIC SHELL

3. LOCALIZED EVOLVING SOURCE WITH UNKNOWN COUPLING TO GENEVA

The first fit the combined geometry with the fewest free parameters.

That did not make it true.

It made it first.

At 15:46, Sterling asked:

"What observation separates one and two?"

Ian answered immediately.

"Next spatial phase epoch."

"How?"

"The inward branch predicts a specific increase in angular phase gradient at fixed source positions. The expanding shell predicts curvature in the transport field in the opposite sense."

"Time?"

"Next useful optical window."

"Months."

"Yes."

Sterling looked at Sarah.

"Anything sooner?"

She thought.

"VLBI."

Marovic shook her head.

"Not enough reference geometry."

"PTA?"

Kovacs answered.

"Temporal update, not enough spatial resolution."

Ian looked at the Geneva data.

"Nothing."

Sterling nodded.

"Then you wait."

Ian looked at the nine-point-six-year model projection.

"We don't have time."

"You have months."

"If model one is right."

"If model one is right, months of verification are cheaper than nine years of building the wrong machine."

Ian did not respond.

Sarah did.

"He's right."

Ian looked at both of them.

"I know."

That evening the official technical group produced a five-page internal note.

No press release.

No headlines.

The title was deliberately unbearable.

Preliminary Kinematic Constraints on a Candidate Nonlinear Geometric Branch Associated with the A-173 / NGC Cross-Domain Anomaly

Ian read it once.

"Nobody will read this."

Sarah answered:

"Excellent."

The conclusions occupied half a page.

The observed angular phase scale and temporal period admit a model-dependent characteristic pattern speed near 0.23 ± 0.02c.

The speed is not a directly observed radial velocity.

The earliest robust optical anomaly, corrected by the parallax-like light-travel distance, is temporally consistent with the Geneva incident epoch within present sampling uncertainty.

A nonlinear inward-propagating branch is the lowest-parameter model currently linking the remote anomaly, Geneva fingerprint, and temporal evolution.

Alternative geometric models remain viable.

Under the inward-branch hypothesis, Earth intercept occurs in approximately 9.6 years, with uncertainty of roughly one year at current model precision.

No destructive front has been observed.

The low-amplitude astronomical anomaly carries finite inferred stress-energy under the MSV model but remains below the calculated nonlinear critical regime.

The physical effect of the high-amplitude branch on matter is unmeasured.

Ian read item seven again.

No destructive front has been observed.

The sentence made the document feel smaller.

The number nine point six made it feel enormous.

They sent the note to twelve people.

Within twenty-three minutes, Marcus Vance had it.

Ian did not know that.

Sarah did.

Her phone vibrated once.

She looked at the screen.

A single message.

How much energy?

No greeting.

No question about certainty.

No request for the paper.

Sarah turned the phone face down.

Ian noticed.

"Who?"

"Someone who reads quickly."

"Who?"

"Vance."

Ian's expression changed.

"How did he get it?"

"Sterling."

"Why?"

"Because if there is even a ten-percent chance your model is right, the next problem is not astronomy."

Ian looked at the small cryogenic test stand upstairs through the open security feed.

"What is the next problem?"

Sarah lifted the phone.

Another message had arrived.

And how large does the hardware have to be?

Sarah looked at Ian.

"That."

Ian did not reply immediately.

Instead he went upstairs.

The compact cryogenic stand occupied one corner of the laboratory.

A short experimental winding.

Vacuum jacket.

Cryogenic plumbing.

Local phase electronics.

A machine that had consumed months to produce effects barely above the noise floor.

Geneva's successful counter-field had depended on a hundred-kilometer collider infrastructure.

Superconducting magnets already cold.

Fast correctors already installed.

RF systems already synchronized.

Power distribution.

Metrology.

A local crisis had been stabilized only because one of the largest scientific machines ever built had accidentally contained most of the required hardware.

Now Ian looked at his bench-top approximation.

Nine and a half years.

He imagined twelve of these.

A hundred.

A thousand.

None mattered.

Sarah entered.

"Well?"

"Current system cannot scale."

"Why?"

"Field uniformity."

"What else?"

"Stored energy."

"What else?"

"Cryogenic losses."

"What else?"

"Conductor strain."

"What else?"

"Actuator latency."

"What else?"

Ian looked at her.

"Do you want the whole list?"

"Eventually."

"Why?"

"Because Vance asked the wrong question."

Ian frowned.

"He asked how much energy."

"Yes."

"That seems relevant."

"It is."

She pointed at the small winding.

"But energy isn't what killed your first fourteen coil tests."

"I have not had fourteen tests."

"Metaphorically."

"That's not how numbers work."

"Your problem isn't equations anymore."

Ian looked at the coil.

"What is it?"

"Metal."

He opened the NGC stabilization record.

The local counter-field had survived for milliseconds.

Not minutes.

It had required existing accelerator infrastructure.

Its effect had been confined to one interaction region.

It had not projected a field across a city.

A country.

A planet.

Ian calculated the scaling envelope.

The numbers became absurd quickly.

Conductor volume.

Stored magnetic energy.

Cryogenic plant.

Mechanical support.

Phase-control channels.

The current design did not fail by a factor of two.

It failed as an architecture.

Sarah looked over his shoulder.

"Now answer Vance."

Ian typed:

The Geneva configuration cannot be scaled directly.

Sarah read it.

"Good."

He continued.

The controlling limitation is not only energy. The present architecture fails on conductor stress, cryogenic stability, field geometry, and response latency before reaching the required scale.

Sarah nodded.

Then Ian added:

A practical system does not currently exist.

He stopped.

That sentence was harder to send than the nine-point-six-year estimate.

Sarah said:

"Send it."

Ian did.

Vance replied forty seconds later.

Then build the one that can.

Ian stared at the message.

Sarah took her coat from the chair.

"Denver."

He looked at her.

"Why do you assume I agreed?"

"Because you've been designing it in your head since the number appeared."

Ian said nothing.

Sarah opened the door.

Rain moved across Paisley in thin gray sheets.

She looked back.

"One more thing."

"What?"

"You said Geneva seeded the fault."

"Preferred model."

"I know."

"Then?"

"If you're wrong, we may spend billions building a shield for the wrong physics."

Ian looked at the screen.

"And if I'm right?"

Sarah's expression did not change.

"Then nine years is nothing."

Ian remained at Coats after she left.

The Hidden Node was dark.

The technical note remained open on one screen.

0.23 ± 0.02c

~9.6 years

He opened his notebook.

For several minutes he wrote nothing.

Then:

OBSERVATION

The astronomical anomaly has a measured angular and temporal structure.

Its retarded onset is consistent with the Geneva epoch within current resolution.

Its reduced geometry matches the NGC anomaly under tested reconstructions.

Then:

MODEL

A nonlinear inward-propagating branch explains the present data with fewer free parameters than the tested alternatives.

Then:

INFERENCE

If that model is correct, characteristic branch speed is approximately 0.23c.

If the branch began near T0, projected Earth intercept is approximately 9.6 years from now.

He paused.

One final heading.

UNKNOWN

He wrote:

Whether there is a front.

Whether it is moving toward Earth.

Whether Geneva caused it.

Whether it can be stopped.

Ian stared at the four lines.

At seventeen, he would have hated the page.

Too many gaps.

Too many unanswered variables.

Now he understood that the gaps were part of the measurement.

He still wanted to close them.

That had not changed.

He turned to a fresh page.

At the top he wrote:

CONTROL REQUIREMENTS

Then stopped.

The first question was not how to explain the rupture.

It was whether geometry that could propagate could also be opposed.

Geneva had answered that question once.

Locally.

For milliseconds.

Inside a machine large enough to have its own horizon of engineering failure.

Ian wrote the first requirement.

Cancellation must survive outside the collider.

Then another.

The field must be carried by hardware, not assumption.

Then:

The machine must fail safely before the geometry does.

He looked at the three lines.

Nine and a half years was not a countdown.

Not yet.

It was a boundary condition.

And for Ian Yoo, boundary conditions had always been where control began.

### [Scene 3: The Causal Limit]

Arthur Sterling's objection arrived at 05:52 the next morning.

Not as an email.

As a diagram.

Ian opened the encrypted attachment in the upstairs network room at Coats Observatory and stared at four labeled points connected by arrows.

G — Geneva

R — Remote anomaly region

O — Earth observer

X — Unknown

The arrow from R to O was solid.

Photons.

The arrow from G to R was dashed.

Ian's preferred causal model.

The arrow from R to G was dashed.

The reverse model.

The lines from X to both were dotted.

Common cause.

Beneath the diagram Sterling had written one sentence.

Which arrow have you measured?

Ian read it twice.

Then called him.

Sterling answered immediately.

"You are awake."

"You sent it at five fifty-two."

"I assumed you would be."

"What do you mean by measured?"

Sterling's face appeared on the terminal.

"You know exactly what I mean."

Ian did.

He looked at the diagram again.

"We measured R to O."

"What did you measure?"

"Electromagnetic observations from the astronomical region."

"Good."

"Astrometric displacement encoded in arriving photons."

"Good."

"With timing support from the PTA."

"Independent observable. Not the same arrow."

Ian nodded.

Sterling continued.

"Did you measure anything traveling from Geneva to the remote region?"

"No."

"From the remote region to Geneva?"

"No."

"From your unknown X?"

"No."

"Then why does your notebook call Geneva the seed?"

Ian looked at him.

"You haven't seen my notebook."

"I know you."

Ian said nothing.

Sterling waited.

Finally Ian answered.

"Because the Geneva event is the earliest instrumented high-amplitude manifestation."

"That makes it early in your records."

"Yes."

"Not necessarily early in the physics."

Ian looked away.

Sterling continued.

"Open the causal chronology."

Ian took the secure terminal downstairs.

Not into the Hidden Node.

The call remained isolated from it.

He placed the screen beside the wall of timelines.

Optical.

PTA.

Geneva.

Model branch.

Sarah joined eight minutes later from an airport lounge in Amsterdam.

Her flight to the United States had been delayed.

She looked at Sterling's diagram.

"Good."

Ian looked at her.

"Of course you like it."

"It's four circles and three kinds of arrows."

"You like anything that removes my nouns."

"I like things you can't hide assumptions inside."

Sterling ignored them.

"Start with what the photons establish."

Ian turned to the wall.

The astronomical distance remained:

$$ D \approx 3.020 \pm 0.010\ \mathrm{ly} $$

Under the parallax-like geometric interpretation.

He wrote:

REMOTE REGION R

Then beneath it:

Observed at O approximately 3.02 years later in ordinary light-travel time.

Sarah said:

"Under the distance model."

Ian added it.

Sterling nodded.

"Now the earliest robust optical anomaly."

Ian wrote:

Observation epoch approximately T0 + 3.04 years

The exact value was not physically meaningful to hundredths of a year because the observing cadence was sparse.

But the central estimate remained close.

He subtracted the light-travel time.

$$ t_{R,\mathrm{retarded}} \approx t_{\mathrm{obs}} - \frac{D}{c} $$

The inferred remote epoch landed close to:

T0

Geneva time.

Within observational uncertainty.

Sterling said:

"Now draw the causal cone."

Ian stopped.

He already knew where the problem was.

Sarah knew too.

Neither spoke.

Sterling waited.

Ian drew Geneva at the left.

Remote region at the right.

Three point zero two light-years apart under the model.

Both events placed approximately at T0.

Then he drew a line at forty-five degrees.

An ordinary light-speed causal boundary.

The two events lay outside one another's conventional light cones at that epoch.

Ian stared at the diagram.

Sterling said:

"Could a signal leaving Geneva at T0 reach R at T0?"

"No."

"At or below c?"

"No."

"Could an ordinary signal leaving R at T0 reach Geneva at T0?"

"No."

Sarah leaned toward her camera.

"So if the retarded epoch and distance model are both approximately right, conventional point-to-point causation in either direction is excluded."

Ian nodded.

"At that epoch."

"Yes."

Sterling said:

"Write that."

Ian did.

IF D approximately 3.02 ly AND REMOTE RETARDED EPOCH approximately T0 ARE PHYSICAL:

G → R BY ORDINARY SUBLUMINAL/LIGHTLIKE PROPAGATION: NOT POSSIBLE

R → G BY ORDINARY SUBLUMINAL/LIGHTLIKE PROPAGATION: NOT POSSIBLE

He stared at the two lines.

Three weeks of evidence had strengthened the connection between Geneva and the sky.

Now the same evidence was destroying his simplest causal story.

Sarah said:

"That's useful."

Ian gave her a look.

She shrugged.

"Very useful."

Sterling spoke.

"So what remains?"

Ian answered without looking at him.

"The distance interpretation could be wrong."

"Yes."

"The inferred remote onset could be wrong."

"Yes."

"The structural correspondence could be coincidental."

"Less likely under our tested nulls, but yes."

"Good."

Ian continued.

"Or Geneva and R could be two local manifestations of one pre-existing connected state."

Sterling raised one finger.

"Model."

"Yes."

"A topology you have not directly measured across three light-years."

"Yes."

"Continue."

"Or both could be responses to an earlier common process."

"X."

"Yes."

"Or the causal relation does not map onto ordinary spatial separation in the way we're assuming."

Sterling nodded.

"Also model."

"Yes."

Sarah said:

"And remote first, Geneva second remains possible if the relevant causal influence originated earlier than the retarded anomaly we can detect."

Ian looked at her.

She continued.

"We do not know that the first detectable astronomical structure marks the beginning of the physical process."

He nodded slowly.

PTA had already taught them that.

Earliest detectable signal was not physical onset.

The remote phenomenon could have existed below their sensitivity before the epoch reconstructed from optical measurements.

Years earlier.

Longer.

There was no observation that ruled it out.

Ian added:

DETECTABLE ONSET ≠ PHYSICAL ONSET

Sterling said:

"Now tell me again that Geneva seeded it."

Ian looked at the sentence.

"The simplest causal model—"

"No."

Sterling's interruption was quiet.

"Not simplest."

Ian stopped.

Sterling continued.

"Your Geneva-seeding model requires an unobserved nonlocal connection to make the chronology work."

Ian said nothing.

"Once you add that assumption, it may still be elegant. It may even be correct."

Sterling looked directly at him.

"But do not call the extraordinary term free."

Ian knew.

The argument was mathematically obvious once stated.

He had simply hidden the most important assumption inside a word.

seeded

Sarah said:

"Change the wording."

Ian looked at the wall.

For several seconds he did nothing.

Then he erased:

The simplest causal model is that the Geneva collision seeded the fault.

He rewrote:

A candidate causal model is that the Geneva event and the remote anomaly became linked through a nonlocal geometric state.

He stared at it.

Then added:

No mechanism for such linkage has been observed.

Sterling nodded.

"Better."

Ian did not feel better.

Sarah's boarding announcement sounded faintly behind her.

She muted the call for several seconds.

When she returned, Ian was still staring at the causal diagram.

"You wanted Geneva to be first," she said.

"No."

"You did."

"Why would I want that?"

"Because causes are easier to control than correlations."

Ian looked at her.

Sarah continued.

"If Geneva caused it, then Geneva contains the mechanism."

"It contains a mechanism either way."

"Maybe."

"We measured counter-field response."

"Locally."

"Yes."

"In one event."

"Yes."

"Under one set of boundary conditions."

"Yes."

Sarah nodded.

"That is the part we can use."

Ian frowned.

"The cause matters."

"For explanation."

"For control."

"Not necessarily."

He looked at her.

Sarah continued.

"If a fire starts because of wiring or lightning, the sprinkler still works on water and heat."

"Spacetime is not a fire."

"No."

"Then don't use—"

"It's an analogy, Ian."

Sterling almost smiled.

Sarah continued.

"We do not need to prove what initiated the phenomenon before testing whether the Geneva cancellation law generalizes."

Ian looked toward the small cryogenic stand upstairs.

That changed the problem.

Not solved.

Changed.

Cause could remain open while intervention became testable.

He said:

"We protect against an observable state, not a preferred history."

Sarah nodded.

"Exactly."

Sterling folded his hands.

"Then set the boundaries."

Ian knew the phrase.

Sarah used it when his equations expanded faster than the apparatus.

He opened a new page.

WHAT HAS BEEN OBSERVED

He wrote:

1. A local geometric/metrology anomaly occurred at Geneva.

2. A matched local counter-field reduced its leading divergent behavior.

3. A remote astrometric anomaly has a reduced geometry statistically compatible with Geneva.

4. PTA archives contain an independent timing residual compatible with the same broad direction and low-frequency evolution.

5. Cross-domain transport structure survives multiple reductions and tested nulls.

Sterling nodded.

"Now model."

Ian wrote:

WHAT IS MODEL-INFERRED

1. Parallax-like geometry maps the remote structure to approximately 3.02 ly.

2. Spatial and temporal scales admit a characteristic pattern speed of approximately 0.23 ± 0.02c.

3. A nonlinear branch model explains the present cross-domain structure with relatively few free parameters.

4. An inward-propagating branch would intercept Earth on a timescale of roughly a decade.

Sarah interrupted.

"Current central projection."

Ian added:

~9.6 years from present, with broad model uncertainty.

"Good."

Sterling said:

"Unknown."

Ian wrote the heading.

Then stopped.

Sarah waited.

He began.

WHAT IS UNKNOWN

Whether a physical front exists.

Whether it has radial motion toward Earth.

Whether the 3.02 ly mapping corresponds to a localized physical source.

Whether Geneva and the remote anomaly share a cause.

Which event, if either, is causally prior.

Whether the nonlinear high-amplitude branch is destructive to matter.

Whether the Geneva counter-field scales beyond the local interaction region.

He paused.

Sterling said:

"Anything else?"

Ian looked at the page.

"Whether we can stop it."

He wrote it.

The list was longer than the model.

Sarah's gate announcement came again.

"Five minutes."

Sterling looked toward her image.

"Denver?"

"Yes."

"Vance?"

"Unfortunately."

Ian looked at her.

"You sound enthusiastic."

"I am enthusiastic about his factories. The rest is under review."

Sterling said:

"Thorne will be there?"

"Already is."

Ian looked at Sterling.

"You know Aris?"

"Everyone who has broken enough superconducting hardware knows Aris Thorne."

Sarah smiled.

"That's almost praise."

"It isn't."

Ian remained focused on the wall.

One phrase bothered him.

Whether the nonlinear high-amplitude branch is destructive to matter.

He opened the branch model.

Sarah saw.

"Don't invent consequences."

"I'm not."

The low-amplitude astronomical precursor carried a finite effective stress-energy under the model.

Nothing in the observations showed matter being damaged.

No disrupted stars.

No spectral evidence of catastrophic local energy deposition.

No anomalous ionization tied to the field.

The danger existed only in extrapolation.

Ian said:

"The current astronomical state is below the calculated critical branch."

"Under MSV."

"Yes."

"So whatever we're observing now is not the thing you're afraid of."

"Correct."

Sterling spoke.

"Then what is the thing you're afraid of?"

Ian looked at the nonlinear solution.

"Loss of smooth geodesic compatibility across extended matter."

Sterling waited.

Ian continued.

"If the high-amplitude branch drives sufficiently large curvature gradients, neighboring parts of an object acquire incompatible free-fall trajectories."

"Scale?"

"Unknown."

"Then don't say molecular."

"I won't."

"Atomic?"

"No."

"Nuclear?"

"No."

Sarah said:

"Structures first."

Ian nodded.

"At lower gradients: mechanical strain, differential loading, failure of extended structures."

"That is defensible," Sterling said.

"And above that?"

"Unmeasured."

Ian left it there.

The apocalypse remained outside the data.

Sarah's video feed froze briefly.

When it returned, she was standing.

"I have to board."

Ian said:

"Send me Thorne's specifications."

"He doesn't have specifications."

"Then what am I reviewing?"

"His failures."

Ian frowned.

Sarah continued.

"You need to know why the hardware you want doesn't exist."

"I know why."

"No. You know why your hardware doesn't exist."

She picked up her bag.

"Aris knows why everyone's doesn't."

The call disconnected.

Ian stared at the empty quadrant of the screen.

Sterling remained.

For several seconds neither man spoke.

Then Sterling said:

"She is right."

"I know."

"That must be exhausting."

Ian ignored him.

Sterling looked again at the causal diagram.

"One final question."

"What?"

"If Geneva was not the cause, does your plan change?"

Ian considered it.

The answer came more slowly than he expected.

"The protection plan?"

"Yes."

"No."

"Why?"

"Because the counter-field responded to the local geometry, not its history."

Sterling nodded.

"If the inward branch model is wrong?"

Ian thought longer.

"Then planetary-scale protection may be the wrong architecture."

"Exactly."

"But a scalable local cancellation system would still be scientifically valuable."

"Yes."

"And potentially protective against any recurrence of the Geneva state."

"Yes."

Ian looked at him.

"So we build the smallest experiment that distinguishes control laws before we build a shield."

Sterling remained silent.

Ian realized what he had just said.

It did not sound like him.

Not the old version.

Sterling said:

"Now I believe Denver may be useful."

Ian looked away.

"I don't need your permission."

"No."

Sterling's face remained expressionless.

"You need their metal."

The call ended.

Ian returned to the Hidden Node.

He stood alone before the three clocks.

The first had measured where.

The second had measured when.

The third had measured response.

None had measured cause.

That distinction was no longer an irritation at the edge of the problem.

It was the problem.

He opened his notebook.

The phrase from three years earlier remained near the front.

The NGC had selected a control law. It had not selected an ontology.

He read it.

Then turned to the new page.

CAUSAL LIMIT

He wrote:

The data support connection more strongly than direction.

Then:

Structural correspondence does not define a causal arrow.

Then:

Retarded astronomical timing places Geneva and the remote anomaly near the same inferred epoch, making ordinary point-to-point causal propagation between them impossible under the current distance model.

He paused.

Below it:

Therefore any direct causal relation requires physics not yet demonstrated, or one of the current geometric/timing inferences is incomplete.

That sentence hurt the Geneva-seeding hypothesis.

He kept it.

At noon, Elena Marovic called.

"I heard you're going to Denver."

"Apparently."

"Bad idea."

"Why?"

"Americans."

Ian waited.

She smiled.

"Also because Vance will ask you for certainty."

"I won't give it."

"I believe that less than I should."

Ian looked at the wall.

"We don't have causal direction."

"I know."

"We don't have radial front motion."

"I know."

"The intercept estimate is conditional."

"I know."

"So what exactly do you think I am going to tell him?"

Marovic considered him.

"That the danger is uncertain but the engineering lead time is long."

Ian said nothing.

"Which is true."

"Yes."

"And that if we wait for certainty, the model could become operationally useless before it becomes scientifically complete."

"Yes."

She nodded.

"That's the argument."

"Not certainty."

"No."

"Risk."

"Exactly."

Ian disliked the word because Marcus Vance would understand it immediately.

Probability multiplied by consequence.

Capital could move long before proof.

Science could not.

The two systems were about to meet.

That afternoon, Ian packed.

He did not have much.

Clothes.

Laptop.

Encrypted project drives.

Printed calibration records.

The Sector Four cartridge remained at Coats.

Sarah had insisted.

Ian agreed.

The original local evidence would not travel unnecessarily.

He made another mirrored research copy for the controlled Denver analysis package.

Hashes.

Read-only export.

Chain of custody.

Boring.

Defensible.

At the bottom of his bag, he found the silver drafting compass.

He had not used it in months.

For a moment he considered leaving it.

Then placed it in the side pocket.

No ceremony.

No circle.

Just an object.

Before leaving for Glasgow Airport, Ian entered the Hidden Node one final time.

He powered on one screen.

Not the rupture model.

The original Geneva local metrology trace.

The moment before cancellation.

The residual rose.

The counter-field engaged.

The leading divergence flattened.

Finite residual remained.

He watched it once.

Then stopped playback.

That was what they actually knew.

A machine had encountered an anomalous geometric state.

A control law had reduced the leading instability.

Everything else came later.

Three light-years.

Pulsars.

Holonomy.

Branch models.

Earth intercepts.

Those mattered.

But they were layers of inference.

This was intervention.

Ian opened a final file.

DENVER TEST OBJECTIVE

He wrote:

Do not reproduce the catastrophe.

Then deleted it.

Too dramatic.

He started again.

OBJECTIVE 1: Reproduce measurable local geometric response outside collider infrastructure.

OBJECTIVE 2: Demonstrate controlled cancellation under independently measured boundary conditions.

OBJECTIVE 3: Separate field-generation limits from conductor, cryogenic, structural, and latency limits.

OBJECTIVE 4: Establish safe failure envelope before scale-up.

He added one final line.

No planetary architecture until local physics survives adversarial hardware testing.

Ian stared at it.

Sarah would approve.

That was annoying.

He saved the file.

At 17:18, the taxi arrived.

Ian stood at the observatory entrance with one bag.

Paisley was wet.

The dome rose behind him in the gray afternoon.

For three years he had used Coats to remove dependencies.

No institution.

No central archive.

No external clock.

No other person's machine.

That period was over.

The next stage required factories.

Superconductors.

Cryogenics.

Power electronics.

Materials science.

Capital.

People.

Systems large enough that no one mind could understand every variable.

The kind of world Ian had spent most of his life distrusting.

He got into the taxi.

Before closing the door, he looked once toward the observatory.

He still did not know whether Geneva had caused the anomaly.

He did not know whether the anomaly was moving toward Earth.

He did not know whether a rupture front existed anywhere outside his equations.

For once, he did not convert those unknowns into certainty.

He carried them with him.

What he knew was narrower.

When Sector Four's geometry had begun to fail, cancellation had worked.

Locally.

Briefly.

Inside one of the largest machines ever built.

That was enough for an experiment.

Not a theory of everything.

Not a shield.

An experiment.

The taxi pulled away.

Ian opened his notebook on his knee.

At the bottom of the causal diagram, beneath every unresolved arrow, he wrote one line.

I don't know what started it.

He looked at the sentence.

Then added:

I know what changed it.

The first sentence was science.

The second was why he was going to Denver.
