<?php get_header(); ?>

<div class="flex flex-col gap-4">
	<h1 class="text-bold text-2xl">F2 Docs</h1>

	<section class="bg-slate-50">
		<h2 class="text-semibold text-xl">Field Schema</h2>
		<ul class="list-none flex flex-col gap-2">
			<li>id</li>
			<li>key</li>
			<li>type</li>
			<li>label</li>
			<li>placeholder</li>
			<li>choices</li>
		</ul>
	</section>

	<section class="bg-slate-50">
		<h2 class="text-semibold text-xl">Form Schema</h2>
		<ul class="list-none flex flex-col gap-2">
			<li>id</li>
			<li>key</li>
			<li>fields</li>
			<li>data</li>
		</ul>
	</section>

	<section class="bg-slate-100 p-4">
		<h2 class="font-semibold text-xl">Form Storage</h2>
		<p>Forms are stored as posts with post_type=form.</p>
		<h3 class="my-4">
			Default forms for the F2 coded app are not stored as posts. They are dynamically created in code.
		</h3>
	</section>

	<div>
		Form.php is the PHP controller for forms.
	</div>

	<div class="bg-gray-900 text-white">
		Forms always belong to exactly 1 model. Thus forms are a child of a model.
	</div>

</div>

<?php get_footer(); ?>
