# Remapper <a href="https://github.com/jaoppb/remapper" target="_blank">![A badge with the GitHub logo and linked to the github repository](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)</a>

I had a problem with my keyboard emitting a phantom key, specifically the \* key on the numpad. After researching some solutions, I found a few that worked partially or required configurations that didn't suit me.

So I thought: why not make a key remapper at the kernel level for Linux? I was inspired by a Windows feature that allows this change through regedit. After some research and reading, I managed to create the module in C and solve my problem by mapping the phantom key to nothing.

<p><img class="fill-width" src="/images/remapper.png" alt="A linux penguin fixing a keyboard. AI generated" /></p>
