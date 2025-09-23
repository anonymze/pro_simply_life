package com.margelo.nitro.math

class HybridMath : HybridMathSpec() {
  override val pi: Double
    get() = Math.PI

  override fun add(a: Double, b: Double): Double {
    return a + b
  }
}
