console.clear()

class Physics {

   constructor(options) {
      this.gravity = options.gravity
      this.friction = options.friction
      this.bounce = options.bounce
      this.unique = 0
      this.list = []
      this.container = options.container
      this.resolution = options.resolution
   }

   add(options) {
      const phyObject = {
         unique: this.unique++,
         pos: options.pos.clone(),
         last: options.pos.clone(),
         radius: options.radius
      }

      this.list.push(phyObject)
      return phyObject
   }

   move(circle) {
      var { gravity, friction, bounce, container } = this
      var { pos, last, radius } = circle
      var { width, height } = ctx.canvas

      // experiment gone terribly wrong
      var vel = pos.clone().min(last).scale(friction).add(gravity.clone().scale(1/this.resolution))
      last = pos.clone()
      pos.add(vel)

      // keep within space v1
      for (var line of container.lines) {
         // var dot = vel.dot(normal)
         var closest = pos.closestPointOnLine(line)
         var distance = closest.distance(pos)

         // draw.circle({ pos: closest, radius: 5 })
         var whitespace = 2
         if (distance <= radius+whitespace) {
            var direction = line[0].direction(line[1])
            var normal = direction.normal()

            pos = closest.clone().add(normal.clone().scale(radius+whitespace))
            last = pos.clone().min(vel.reflect(direction).scale(bounce))
            // last = pos.clone()
         }
      }

      circle.pos = pos
      circle.last = last
   }

   resolve() {
      for (let i = 0; i < this.resolution; i++) {
         var { bounce } = this

         for (let circle_0 of this.list) {
            this.move(circle_0)

            for (let circle_1 of this.list) {
               if (circle_0.unique == circle_1.unique) continue

               var combinedRadius = circle_0.radius + circle_1.radius
               var distance = circle_0.pos.distance(circle_1.pos)

               if (distance < combinedRadius) {
                  // resolve the collision
                  var overlap = (combinedRadius - distance) / 2
                  var direction = circle_0.pos.direction(circle_1.pos)

                  circle_0.pos.min(direction.clone().scale(overlap * bounce))
                  circle_0.last.add(direction.clone().scale(overlap * bounce))
                  circle_1.pos.add(direction.clone().scale(overlap * bounce))
                  circle_1.last.min(direction.clone().scale(overlap * bounce))
               }
            }
         }
      }
   }
}
//============================================================================================================================
class Circle {
   constructor(pos, radius) {
      this.color = ['#4a9', '#c78', '#49a'][Math.floor(Math.random() * 3)]
      this.physics = physics.add({
         pos: pos,
         radius: radius
      })
   }


   draw() {
      const { radius, pos } = this.physics
      const { x, y } = pos

      ctx.beginPath()
      ctx.strokeStyle = this.color
      ctx.lineWidth = 2
      ctx.arc(x, y, radius - ctx.lineWidth*0.75, 0, Math.PI * 2)
      ctx.stroke()
   }
}

//=============================================================================================================================

class Container {
   constructor(options) {
      const { pos, size, sides } = options

      this.pos = pos
      this.size = options.size
      this.sides = sides || 3
      this.points = []
      this.lines = []

      var angle = Math.PI * 2 / sides
      for (var i = 0; i < sides; i++) {

         var point = new Vector(
            Math.cos(angle*i),
            Math.sin(angle*i)
         )
         this.points.push(point.scale(this.size).add(this.pos))
      }

      for (var i = 0; i < this.points.length; i++) {
         this.lines.push([
            this.points[i],
            this.points[(i == this.points.length-1) ? 0 : (i+1)]
        ])
      }
   }

   draw() {
      ctx.lineWidth = 3
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#FFF'
      ctx.beginPath()

      ctx.moveTo(this.points[0].x, this.points[0].y)
      for (var i = 1; i < this.lines.length; i++) {
         ctx.lineTo(this.points[i].x, this.points[i].y)
      }

      ctx.closePath()
      ctx.stroke()
   }

   spin(speed) {
      const angle = speed

      for (let point of this.points) {
         const x = point.x - this.pos.x
         const y = point.y - this.pos.y

         point.x = Math.cos(angle) * x - Math.sin(angle) * y
         point.y = Math.sin(angle) * x + Math.cos(angle) * y
         point.x += this.pos.x
         point.y += this.pos.y
      }
   }
}
//============================================================================================================================

class Vector {
   constructor(x, y) {
      this.x = x || 0
      this.y = y || 0
   }

   clone() { return new Vector(this.x, this.y) }
   setX(x) { this.x = x; return this }
   setY(y) { this.y = y; return this }
   add(v) { this.x+=v.x; this.y+=v.y; return this }
   min(v) { this.x-=v.x; this.y-=v.y; return this }
   scale(s) { this.x*=s; this.y*=s; return this }
   unit() { return this.scale(1/this.length()) }
   distance(v) { return this.clone().min(v).length() }
   angle() { return Math.atan2(this.y, this.x) + Math.PI }
   direction(v1) { return v1.clone().min(this).unit() }
   normal() { return new Vector(-this.y, this.x) }
   dot(v1) { return this.x*v1.x+this.y*v1.y }
   length() { return Math.sqrt(this.x*this.x + this.y*this.y) }
   reflect(direction) {
      const dot = direction.dot(this)
      return direction.clone().scale(dot*2).min(this)
   }
   closestPointOnLine(line) {
      const direction = line[0].direction(line[1])
      const length = line[0].clone().min(line[1]).length()
      const relative = this.clone().min(line[0])

      // Project point on line
      let over = relative.dot(direction)/length
      over = Math.max(Math.min(over, 1), 0)

      return direction.scale(length * over).add(line[0])
   }
}

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

const ctx = canvas.getContext('2d')
const center = new Vector(canvas.width/2, canvas.height/2)

const physics = new Physics({
   gravity: new Vector(0, 0.15),
   friction: 0.995,
   bounce: 0.25,
   resolution: 1,
   container: new Container({
      pos: center,
      size: 150,
      sides: 3
   })
})

const circles = []

let count = 30
const addCircle = () => {

   if (count--) setTimeout(addCircle, 100)

   const radius = Math.random() * 8 + 5
   const pos = physics.container.pos
   const circle = new Circle(pos, radius)
   circles.push(circle)
}

addCircle()


render()
function render() {
   requestAnimationFrame(render)
   ctx.clearRect(0, 0, canvas.width, canvas.height)
   physics.resolve()

   for (let circle of circles) circle.draw()
   physics.container.spin(Math.PI*0.0075)
   physics.container.draw()
}
