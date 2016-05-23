---
layout: default.html
title: LucidCSS
---

<section class="home__header">
  <h1 class="title">Lucid<span class="light">CSS</span></h1>
  <h2 class="desc">The Style Guide On Keeping Things Simple</h2>
</section>


<section class="home__book">

#### LucidCSS is a style guide that I developed that completely revolutionizes the way CSS is organized and structured. The core foundation of LucidCSS is that CSS should be *extremely simple*. When things are simple, they are also maintainable. Instead of focusing on DRY concepts and perfect byte optimizations, LucidCSS focuses on simplicity.

<iframe class="github" src="http://hubstar.io/github/spin/kennethwang14/LucidCSS?name=%20"></iframe>

## Complete Separation of Concerns

Before I explain the style guide rules, it's important to understand the reasonings behind them. LucidCSS believes that **style and architecture should be completely separated**. Here is an example of non-separated, unmaintainable HTML/CSS:

```html
<div class="col-xs-3 col-md-1 col-lg-1 blk m-10 social-btn-container">
    <a href="#" class="btn btn-social btn-block btn-google">Google</a>
    <a href="#" class="btn btn-social btn-block btn-twitter">Twitter</a>
 </div>
 ```

*What class is doing what? What do I do if I wanted to change the appearance of one of the buttons? What part do I edit? Do I edit the styles for one of the classes, and if so, which one? What if I just wanted to add a slight margin to the first button; do I need to add a new class for that?*

The problem is that the HTML and CSS are entangled together. Before you can make any changes, you are required to first look through the HTML to find the list of classes, and then you must understand each class. Then when you make the change, you're most likely editing HTML as well as CSS. HTML is being heavily involved in the aspect of styling.


This is a pretty extreme example. However, I still see modern style guides recommend "adding an utility class in HTML". No, that is the wrong approach. HTML is purely for architecture, and CSS is purely for design. If you want to edit the appearance of something, you should know exactly where you need to edit it. An utility class completely breaks this by adding HTML to the table. This brings me to the first rule...

## Rule #1: A Single Class Per Element

This is the most important rule; the foundation which LucidCSS is built upon. Let me repeat it for emphasis, there should only be a *single class* per element. That is how you separate concerns. There are two other problems with the above HTML example that I didn't mention before. The first is that because the classes are meant for extreme re-use, it limits your flexibility. You have to work within the limitations and framework of the utility classes. The second problem is that time is wasted when you have to search between different files for the locations of every single listed class. This rule solves both of those problem.

This rule does change a few things though. For starters, **CSS classes are no longer modular nor re-usable**. This help avoids CSS anti-patterns like `class="btn btn-social btn-block btn-google`. Hold on, don't panic yet. Modularity still exists...

## Rule #2: Modularity Through Mixins

Instead of the HTML `class=` attribute being a container for modular, re-usable CSS classes, your singular CSS class is the container for modular, re-usable mixins. Remember the messy HTML example above? Let me share the LucidCSS version of it:

```html
<div class="home__social-buttons">
    <a href="#" class="button--google">Google</a>
    <a href="#" class="button--twitter">Twitter</a>
 </div>
```
```scss
.home__social-buttons {
    @include container($default-padding);
    @include grid(1, 3);


    .button--google {
        @include social-button($color--google);
    }

    .button--twitter {
        @include social-button($color--twitter);
    }
}
```

Look how much cleaner this is to both read and write! Here is one of the questions I gave earlier for the example: **What if I just wanted to add a slight margin to the first button?** If you weren't using LucidCSS, you would either need to add inline CSS using `style=`, add a new utility class for margin, or create a variant for one of the buttons that has more margin. In LucidCSS, it is this simple:

```
.button--google {
    @include social-button($color--twitter);
    margin-bottom: 2rem;
}
```

One of the biggest advantages of modular mixins over classes is that they can accept arguments. When you create a new mixin, abstract the CSS rules that you believe will change often. Use default values too so you don't need to rewrite it every time when calling the mixin.

```scss
@mixin button($color: color(theme),
              $margin-bottom: $default-margin} {
    padding: 2rem 4rem;
    background-color: $color;
    border-color: mix($color, black, 10%);
    margin-bottom: $margin-bottom;
    display: inline-block;
}
```

Be careful not to create too many parameters for a mixin though. Remember, the goal is simplicity, and having a parameter for every single CSS rule is confusing. Sometimes, it is better to create a *mixin variant* instead of adding more parameters.

```scss
@mixin button--small($color: color(theme),
                    $margin-bottom: $default-margin) {
    @include button($color, $margin-bottom);
    padding: 1rem 2rem; // half of regular button              
}
```

Mixins also allow for inheritance as you can see in the example above. Due to the way specificity works, only the latest instance of a rule declaration takes effect.

## Rule #3: Namespace

>In many programming languages, namespacing is a technique employed to avoid collisions with other objects or variables in the global namespace. They're also extremely useful for helping organize blocks of functionality in your application into easily manageable groups that can be uniquely identified.
><cite><a href="https://addyosmani.com/blog/essential-js-namespacing/">Addy Osmani</a></cite>

I'm going to divide HTML elements into "outer" and "inner" elements. Outer elements are `div` or `section` that are direct children of the body. Inner elements are the elements contained by outer elements.

Outer elements are namespaced with the format of `page__container-name`. Sometimes, there are global modules that are not page-specific. In that case, name them like `global__container-name`. The `container-name` portion should concisely describe the content inside of the container. Every outer container class should be **completely unique, and not to be re-used**. Inner element classes can be re-used, but you still need to follow the rule of having a singular class per element.

Here is some code example:

```html
<nav class="global__nav">
 <!-- code for navigation bar -->
</nav>



<section class="about__introduction">
    <h1 class="title">Who I Am</h1>
    <p class="body">Award winning web developer from Bellevue, Washington</p>
</section>

<section class="about__featured-on">
    <h1 class="title">Featured On:</h1>
    <div class="thumbnail-section">
        <img class="thumbnail" src="google.png">
        <img class="thumbnail" src="twitter.png">
    </div>
</section class="about__featured-on">



<footer class="global__footer">
 <!-- code for footer -->
</footer>
```
```scss
.about__introduction {
  @include container;
  
    .title {
      @include size(h2);
      text-align: center;
    }
  
    .body {
      @include size(p);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
}


.about__featured-on {
  @include container($color--grey);
  
    .title {
      @include size(h3);
      color: $color--theme;
      letter-spacing: 0.04rem;
    }
  
    .thumbnail-section {
      width: 100%;
      padding: $default-padding;
    }
  
        .thumbnail {
          border: 1px solid $color--grey;
          width: 6em;
          height: 6em;
          display: inline-block;
          margin-right: 2em;
        }
}
```

One thing that you will immediately notice is that nesting is used. You've probably heard so many times how you should never nest in Sass and that it can create a specificity nightmare. In LucidCSS, nesting is cleverly used to *avoid* specificity issues. In fact, you hardly need to worry about specificity at all because every single line of code you write in a namespace is quarantined to that namespace.

This also lets you simplify class names for inner elements. `about__introduction` and `about__featured-on` both contain a class called `title`, but the two are styled completely different and are not related at all. They are simply called `title` because "title" is the simplest name I thought of, and it clearly describes the content in relationship to the section.

## Making Use Of Variables

Variables are a powerful feature that is often ignored, or not used to its full potential. You should not have any magic numbers in your code. Wikipedia defines magic numbers as:

>Unique values with unexplained meaning or multiple occurrences which could (preferably) be replaced with named constants
><cite>Wikipedia</cite>

Variables add context to your code -- and that makes things simpler. If you are constantly using 2rem for button padding, you should make a `button-padding` variable for it. Imagine if your client suddenly tells you to increase the button padding, you can then easily do it by simply changing the value of the variable, instead of searching for every instance.

## Recommended Coding Convention

1. The order of your CSS classes should reflect the layout appearance of the HTML webpage. Things at the top of the HTML webpage should be listed first in CSS. Follow the order of top to bottom,  left to right if there are multiple grid elements in a row.
2. Use line breaks aggressively to organize.
3. Using indents, your CSS classes should reflect the parent-child relationships of the HTML DOM. In the previous example, notice how `thumbnail-section` is clearly the parent of `thumbnail` just by looking at in the stylesheet.
4. Only nest a single layer generally. Notice how `thumbnail-section` is not nested within `thumbnail`.
5. To override a declaration in a mixin, the declaration has to be below the mixin. For this reason, mixins should generally be placed at the top of every class.

## Regarding Templates

Earlier, I said that every page should have its own unique outer container. Yes, doing so would give the most flexibility -- for example, if you only wanted X page to have a slightly bigger padding.

However, sometimes, this approach may be counter-intuitive. Imagine a scenario where a static site generator creates a page for every state in the US. Instead of having an unique namespace for every page (`alabama__infobox`, `alaska__infobox`, `arizona__infobox` ...), it is better to simply use a *template namespace*: `states-page__infobox`.

In a template namespace, there is less flexibility as it is harder to only style the page for Alabama when every state page share the same template. However, it's still possible by using an *external class*.

```html
<section class="states-page__infobox alabama__infobox">
  <h1 class="title">Alabama</h1>
  <p class="desc">Lorem ipsum dolor sit amet</p>
</section>
```
```scss
.states-page__infobox {
  @include container;

      .title {
        @include margin-bottom(2);
      }
      .desc {
        font-weight: 100;
      }



  /* External Class */
  &.alabama__infobox {
      .title {
        @include margin-bottom(3);
      }
  }
}
```

## Regarding Global Rules

I refer to non-namespaced CSS rules as *global* rules. I recommend **not** having any global rules for HTML tags (`h1`, `div`, `a`, etc). Global rules for HTML tags makes things harder to maintain, because it adds an extra place where styling is defined.

However, it is fine to have global rules using class names because it's clear when you use them. The usual case for this is for styling partials that contain a variety of HTML elements inside. Instead of using an `@include` for every single HTML element in the partial, it's simpler to use global rules.

```scss
/* this is unintuitive */

.home__nav {
  @include nav--container;
  ul {
    display: block;
  }
  li {
    display: inline-block;
  }
  a {
    @include nav--link;
  }
  .divider {
    border-right: 1px solid grey;
  }
}

.about__nav {
  @include nav--container;
  ul {
    display: block;
  }
  li {
    display: inline-block;
  }
  a {
    @include nav--link;
  }
  .divider {
    border-right: 1px solid grey;
  }
}

.contact__nav {
  @include nav--container;
  ul {
    display: block;
  }
  li {
    display: inline-block;
  }
  a {
    @include nav--link;
  }
  .divider {
    border-right: 1px solid grey;
  }
}
```

```scss
/* much simpler */

.global__nav {
  @include nav--container;
  ul {
    display: block;
  }
  li {
    display: inline-block;
  }
  a {
    @include nav--link;
  }
  .divider {
    border-right: 1px solid grey;
  }
}
```

## Suggested Naming Convention

Syntactically, my suggested naming convention looks like BEM, but it is not BEM.

* For the class name of outer elements, use `template/page__container-name`. Example: `.about__featured-on`.
* For the class name of inner elements, use the simplest and most concise name. Example: `.title`.
* For mixins, use `module--variant` The variant is optional. Example: `button` and `button--small`.

## Suggested File Structure

I use a simplified version of the [Hugo Giraudel's 7-1 architecture pattern](https://github.com/HugoGiraudel/sass-boilerplate).

```
│───scss
│   ├───base
│   ├───layout
│   ├───modules
│   └───pages
```
```scss
@charset 'UTF-8';

// Base
@import
  'base/reeeset',
  'base/color',
  'base/typography';

// Modules
@import 'modules/helpers/*.scss';
@import 'modules/**/*.scss';

// Partials
@import 'partials/**/*.scss';

// Pages
@import 'pages/**/*.scss';
```

The files in my `base` folder lay the foundation for everything else. They include the most important rule declarations, functions, and mixins that other modules may rely on. The order of import for files in the `base` folder often matter.

Next, the files in my `module` folder are my *modular* mixins. I also have a folder in it called `helpers` for utility mixins such as `center`, `hover`, and `clearfix`.

The files in my `partials` folder contain global rules for partials such as `.global__nav`, `.global__footer`, and `.global__featured-button`.

Lastly, I import namespaced, page-specific (or template-specific) rules in the `pages` folder. 


## Mixins Carry Over And Encapsulate

Because simply declaring a mixin does not add any file size to the outputted CSS, there isn't any reason to delete a mixin once you have created it. This also means that once you have created a mixin, it can be used for *every single future project!* Simply copy and paste your mixins folder each time you start a new project. This allows for very rapid development.

Mixins also encapsulate information. After I created a mixin for [Nicole Sullivan's media object](http://www.stubbornella.org/content/2010/06/25/the-media-object-saves-hundreds-of-lines-of-code/), I no longer needed to remember how the media object worked, *ever again for all my future projects*. All I need to remember is where to use the mixin.

```
 @mixin media-wrapper {
   overflow:hidden;
   _overflow:visible;
   zoom:1;
 }

 @mixin media-image($margin: 1rem) {
   float:left;
   margin-right: $margin;
   img {
     display: block;
   }
 }

 @mixin media-body {
   overflow:hidden;
   _overflow:visible;
   zoom:1;
 }
```

## Regarding File Size

LucidCSS heavily uses mixins, so the CSS output will have a large amount of repetitions. Luckily, Gzip compression does incredibly well compressing files with lots of repetitions. Read this [experiment by Harry Roberts](http://csswizardry.com/2016/02/mixins-better-for-performance/) comparing `@extend` (less repetitions, more unique classes) and `@mixins`.

>The absolute numbers seem trivial (a mere 6K), but in relative terms, we can achieve a 27% saving over the wire simply by opting to use mixins to repeat declarations over and over, as opposed to using @extend to repeat a handful of selectors.<br><br>My tests showed pretty conclusively that mixins end up being better for network performance than using @extend. The way gzip works means that we get better savings even when our uncompresssed files are substantially larger.
><cite>Harry Roberts</cite>

## Closing Words

LucidCSS is a flexible and adaptable style guide -- there are only three rules to follow. However, you should think of them more as *guidelines*, and I encourage you to experiment with them. The web industry is constantly changing, and what experts declare as "the right way" often turn out to be non-optimal after time passes. As long as you follow the core principles of LucidCSS, your style guide or framework can be considered a *lucid* one.

<iframe class="github" src="http://hubstar.io/github/spin/kennethwang14/LucidCSS?name=%20"></iframe>


</section>