<template>
		<a :title="title" style="margin:10px">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>
<script type="text/javascript">
	export default{
		name: "HintButton",
    props: ["title"]
	}
</script>