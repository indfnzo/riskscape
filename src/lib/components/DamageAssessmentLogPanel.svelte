<script lang="ts">
	import type { DamageAssessmentLog } from '$lib/stores';

	export let log: DamageAssessmentLog;
</script>

<button class="panel-button">{log.inspectorAffiliation} - {log.inspectionDate}</button>
