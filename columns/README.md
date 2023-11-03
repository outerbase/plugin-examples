# Column Plugins

All plugins in Outerbase are powered by [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)! Web Components come with [built in methods](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks) that help to enable reactivity and empower you to create anything you want.

## How do they work?

Like an HTML tag, Outerbase provides your web component with default attributes that you can interact with.

```js
<outerbase-plugin-cell
  id="plugin-component"
  cellvalue="null"
  configuration="{}"
  metadata='{"theme":"dark"}'
></outerbase-plugin-cell>
```

If you want to get a value from your plugin, you can use `this.getAttribute("cellvalue");` or `this.getAttribute("metadata");`. We encode the values in our tags, so be sure to decode the attributes after you get them.
