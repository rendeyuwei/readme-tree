# readme-tree README

When you are writing a readme for your project, sometimes you need to quickly insert a project tree structure, if you are bothered, you should try this plugin.

Right-click in your readme, click Get Directory Tree, and generate a tree structure with just one click.

And also this plugin may not perform as expected in certain situations, and welcome everybody fork and push!

## configuration

you can configure something in settings now.

1. deep(number)

    It determines the maximum depth of the displayed project tree structure.(Sometimes, project may very complicated, so, you may need to customize)
    default value is null, it means no limit.

    e.g. 1



2. ignoreFile(array)

    It determines which files need to be ignored

    default value: [".git", "node_modules", ".idea"]

## TODO

- [x] Add configuration files, including files that need to be ignored, maximum depth, etc.
