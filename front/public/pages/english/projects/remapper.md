# Remapper

I had a problem with my keyboard emitting a phantom key, specifically the \* key on the numpad. After researching some solutions, I found a few that worked partially or required configurations that didn't suit me.

So I thought: why not make a key remapper at the kernel level for Linux? I was inspired by a Windows feature that allows this change through regedit. After some research and reading, I managed to create the module in C and solve my problem by mapping the phantom key to nothing.
