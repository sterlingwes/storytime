<stlistview>
  <ul>
    <li each={ state.items }>
      { project } - { name }
    </li>
  </ul>

  <script>
    this.mixin('redux')
    this.use({items: 'stories.stories'})
    
    this.on('mount', function() {
      this.store.trigger('fetch');
    }.bind(this))
  </script>
</stlistview>