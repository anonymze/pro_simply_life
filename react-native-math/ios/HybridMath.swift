class HybridMath : HybridMathSpec {
  public var pi: Double { Double.pi }

  public func add(a: Double, b: Double) throws -> Double {
    return a + b
  }
}
