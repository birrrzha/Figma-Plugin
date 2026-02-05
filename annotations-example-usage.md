const node = figma.currentPage.selection[0]

// Add an annotation note
node.annotations = [{ label: 'Main product navigation' }]

// Pin the fill property
node.annotations = [{ properties: [{ type: 'fills' }] }]

// Add an annotation with a note and width property pinned
node.annotations = [
  { label: 'Pressing activates animation', properties: [{ type: 'width' }] },
]

// Add a rich-text annotation label with markdown
node.annotations = [
  { labelMarkdown: '# Important \n Pressing activates a *fun* animation' },
]

// Add multiple annotations with annotation categories
categories = await figma.annotations.getAnnotationCategoriesAsync()
interactionCategory = categories[1]
a11yCategory = categories[2]

node.annotations = [
  {
    label: 'Pressing activates animation',
    categoryId: interactionCategory.id,
  },
  {
    label: 'Fill in aria-label with i18n string',
    categoryId: a11yCategory.id,
  },
]

// Clear an annotation
node.annotations = []