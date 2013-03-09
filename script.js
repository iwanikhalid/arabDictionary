var currentID = 1,
    startY = 0,
    dist = 0,
    active, prev, next,
    maxDist = 150,
    threshold = 40

var maxR = 10,
    minOpacity = .65,
    pageHeight = window.innerHeight

document.body.addEventListener('touchstart', function (e) {
    e = e.changedTouches[0]
    var layer = getActiveLayer(e.target)
    if (layer) {
        active = layer
        onStart(e)
    }
})

document.body.addEventListener('touchmove', function (e) {
    e.preventDefault()
    if (!active) return
    onMove(e.changedTouches[0])
})

document.body.addEventListener('touchend', function () {
    if (!active) return
    onEnd()
})

function onStart (e) {
    startY = e.pageY
    prev = document.querySelector('.prev[data-id="' + (currentID - 1) + '"]')
    next = document.querySelector('.next[data-id="' + (currentID + 1) + '"]')
    active.classList.add('drag')
    if (prev) prev.classList.add('drag')
    if (next) next.classList.add('drag')
}

function onMove (e) {

    dist = (e.pageY - startY) / 2
    var pct, r

    if (dist > 0) { // down

        if (!prev) return
        if (next) next.style.opacity = 0
        active.style.webkitTransform = 'translate3d(0,' + dist + 'px, 0)'
        pct = dist / maxDist
        r = Math.max(0, maxR -  pct * maxR)
        prev.style.webkitTransform = 'rotateX(' + r + 'deg)'
        prev.style.opacity = minOpacity + pct * (1 - minOpacity)
        active.style.opacity = (1 - pct) * 5

    } else { // up

        if (!next) return
        if (prev) prev.style.opacity = 0
        pct = -(dist / maxDist)
        next.style.opacity = pct * 5
        next.style.webkitTransform = 'translate3d(0,' + Math.max(0, maxDist + dist) + 'px, 0)'
        r = Math.min(maxR, maxR * pct)
        active.style.webkitTransform = 'rotateX(' + r + 'deg)'
        active.style.opacity = 1 - pct * (1 - minOpacity)

    }
}

function onEnd (e) {

    active.classList.remove('drag')
    if (prev) prev.classList.remove('drag')
    if (next) next.classList.remove('drag')

    if (dist >= threshold) { // trigger down

        if (!prev) return

        active.style.opacity = 0
        active.style.webkitTransform = 'translate3d(0,' + maxDist + 'px, 0)'
        prev.style.opacity = 1
        prev.style.webkitTransform = 'none'

        active.classList.remove('active')
        active.classList.add('next')
        prev.classList.remove('prev')
        prev.classList.add('active')

        currentID--

    } else if (dist > -threshold && dist < threshold) { // cancel

        active.style.opacity = 1
        active.style.webkitTransform = 'none'
        if (prev) {
            prev.style.opacity = minOpacity
            prev.style.webkitTransform = 'rotateX(' + maxR + 'deg)'
        }
        if (next) {
            next.style.opacity = 0
            next.style.webkitTransform = 'translate3d(0,' + maxDist + 'px, 0)'
        }

    } else { // trigger up

        if (!next) return

        active.style.opacity = minOpacity
        active.style.webkitTransform = 'rotateX(' + maxR + 'deg)'
        next.style.opacity = 1
        next.style.webkitTransform = 'none'

        active.classList.remove('active')
        active.classList.add('prev')
        next.classList.remove('next')
        next.classList.add('active')

        currentID++

    }
    dist = 0
    active = null
}

function getActiveLayer (el) {
    while (el !== document) {
        if (el.classList.contains('active')) {
            return el
        } else {
            el = el.parentNode
        }
    }
}