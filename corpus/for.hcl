===
For loop for tuple
===

cidr_blocks = [
  for num in var.subnet_numbers:
  cidrsubnet(data.aws_vpc.example.cidr_block, 8, num)
]

---
