<script setup>
const props = defineProps({
  attribute: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  showAction: {
    type: Boolean,
  },
})
const emit = defineEmits(['setActions', 'attributeUpdated', 'deleteAttribute', 'deleteTerm'])

const config = useRuntimeConfig()
const { message, errorMsg } = useAppState()
const { saveDoc } = useHttp()
const newTerm = ref('')
const termInputRef = ref(null)
const attributeInputRef = ref(null)
const newAttribute = reactive({
  ...props.attribute,
})

const addAttribute = async () => {
  const attribute = await saveDoc('attributes', newAttribute)
  attributeInputRef.value.blur()
  if (Object.values(attribute).length) emit('attributeUpdated', attribute)
}

const addAttributeTerm = async () => {
  if (!props.attribute._id) return (errorMsg.value = 'Attribute is required')
  if (props.attribute.attributeterms.find((t) => t.name === newTerm.value))
    return (errorMsg.value = 'Terms must be unique for each attribute')
  const attributeTerm = await saveDoc('attributeterms', { name: newTerm.value, parent: props.attribute._id })
  if (Object.values(attributeTerm).length) {
    newTerm.value = ''
    emit('attributeUpdated')
  }
}
</script>

<template>
  <tr>
    <td class="w-6">
      <div class="base-input">
        <input class="w-full p-1" type="text" required v-model="newAttribute.sortOrder" @keyup.enter="addAttribute" />
      </div>
    </td>
    <td class="w-20">
      <div class="base-input">
        <input type="text" ref="attributeInputRef" required v-model="newAttribute.name" @keyup.enter="addAttribute" />
      </div>
    </td>
    <td>
      <div class="attribute-terms flex-row wrap items-center gap-05" @click="termInputFocus" v-show="attribute._id">
        <div
          class="flex-row gap-05 border border-slate-300 br-3 text-sm items-center py-02 px-05 text-slate-50 bg-slate-500"
          v-for="(term, j) in attribute.attributeterms"
          :key="term"
        >
          <span>{{ term.name }}</span>
          <button class="btn btn__secondary">
            <IconsClose class="w-1 h-1 fill-slate-50" @click="$emit('deleteTerm', term._id)" />
          </button>
        </div>
        <div class="form-group" @click="checkIfAttribute">
          <input
            ref="termInputRef"
            type="text"
            v-model="newTerm"
            placeholder="Attribute Term"
            :disabled="newAttribute.name == ''"
            @keyup.enter="addAttributeTerm"
            @focus="termInputRef.closest('.attribute-terms').classList.add('selected')"
          />
        </div>
      </div>
    </td>
    <td class="w-12">
      <EcommerceAdminRowActions
        :showAction="showAction"
        @moreHoriz="$emit('setActions', { index: index, action: !showAction })"
        @deleteAction="$emit('deleteAttribute', attribute._id)"
        @cancel="$emit('setActions', { index: index, action: false })"
      />
    </td>
  </tr>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

td {
  border-bottom: 1px solid $stone-300;
  padding: 0.5rem;
}
</style>
