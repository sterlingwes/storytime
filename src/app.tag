<app>

  <ul>
    <li>
      <a href="/">Home</a>
    </li>
    <li>
      <a href="/about">About</a>
    </li>
  </ul>

  <todo show={ page === 'todo' }></todo>
  <div show={ page === 'about' }>
    <p>Oh hai :)</p>
  </div>

  <script>
    var self = this

    self.page = 'todo'

    riot.route(function (page) {
      self.page = page || 'todo'
      self.update()
    })
  </script>
</app>